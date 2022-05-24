	//scroll progress
	var scrollProgress = null;

	$(window).scroll(function () {
		var viewportHeight = $(this).height(),
			scrollbarHeight = viewportHeight / $(document).height() * viewportHeight,
			progress = $(this).scrollTop() / ($(document).height() - viewportHeight),
			distance = progress * (viewportHeight - scrollbarHeight) + scrollbarHeight / 2 - $('#scrollProgress').height() / 2;

		$('#scrollProgress')
			.css('top', distance)
			.text('Progress ' + Math.round(progress * 100) + '%')
			.fadeIn(100);

		// Fade out the annotation after 1 second of no scrolling.
		if (scrollProgress !== null) {
			clearTimeout(scrollProgress);
		}
		scrollProgress = setTimeout(function () {
			$('#scrollProgress').fadeOut();
		}, 500);
	});

	//text-hovver-motion
	const text01 = document.querySelector(".text-hover-motion");
	document.body.addEventListener("mousemove", evt => {
		const mouseX = evt.clientX;
		const mouseY = evt.clientY;
		gsap.set(".text-hover-motion .cursor", {
			x: mouseX,
			y: mouseY
		})

		gsap.to(".text-hover-motion .circle", {
			x: mouseX,
			y: mouseY,
			stagger: -0.1
		})
	})

	//text-paint-motion
	gsap.timeline({
		scrollTrigger: {
			trigger: '.text-paint-motion .painted',
			scrub: 0.3,
			start: "top 40%",
			end: "top 20%",
			//markers:true
		}
	}).to('.text-paint-motion .painted', {
		clipPath: "inset(0% 0% 0% 0%)",
		duration: 1,
		ease: 'none',
		stagger: 1
	})
	
	//text-invert-motion
	gsap.utils.toArray(".text-invert-motion .motion-section").forEach(section => {
		let tl = gsap.timeline({
			scrollTrigger: {
				trigger: '.text-invert-motion .motion-section',
				start: "center center",
				// makes the height of the scrolling (while pinning) match the width, thus the speed remains constant (vertical/horizontal)
				end: () => "+=" + section.offsetWidth,
				scrub: true,
				pin: true,
				anticipatePin: 1
			},
			defaults: {
				ease: "none"
			}
		});
		// animate the container one way...
		tl.fromTo(section.querySelector(".text-invert-motion .after"), {
				xPercent: 100,
				x: 0
			}, {
				xPercent: 0
			})
			// ...and the image the opposite way (at the same time)
			.fromTo(section.querySelector(".text-invert-motion .after .mask"), {
				xPercent: -100,
				x: 0
			}, {
				xPercent: 0
			}, 0);
	});





//

gsap.registerPlugin(ScrollTrigger);

let iteration = 0; // gets iterated when we scroll all the way to the end or start and wraps around - allows us to smoothly continue the playhead scrubbing in the correct direction.

const spacing = 0.1,    // spacing of the cards (stagger)
	snap = gsap.utils.snap(spacing), // we'll use this to snap the playhead on the seamlessLoop
	cards = gsap.utils.toArray('.cards li'),
	seamlessLoop = buildSeamlessLoop(cards, spacing),
	scrub = gsap.to(seamlessLoop, { // we reuse this tween to smoothly scrub the playhead on the seamlessLoop
		totalTime: 0,
		duration: 0.5,
		ease: "power3",
		paused: true
	}),
	trigger = ScrollTrigger.create({
		start: 0,
		onUpdate(self) {
			if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
				wrapForward(self);
			} else if (self.progress < 1e-5 && self.direction < 0 && !self.wrapping) {
				wrapBackward(self);
			} else {
		scrub.vars.totalTime = snap((iteration + self.progress) * seamlessLoop.duration());
				scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween. No need for overwrites or creating a new tween on each update.
				self.wrapping = false;
			}
		},
		end: "+=3000",
		pin: ".gallery"
	});

function wrapForward(trigger) { // when the ScrollTrigger reaches the end, loop back to the beginning seamlessly
	iteration++;
	trigger.wrapping = true;
	trigger.scroll(trigger.start + 1);
}

function wrapBackward(trigger) { // when the ScrollTrigger reaches the start again (in reverse), loop back to the end seamlessly
	iteration--;
	if (iteration < 0) { // to keep the playhead from stopping at the beginning, we jump ahead 10 iterations
		iteration = 9;
		seamlessLoop.totalTime(seamlessLoop.totalTime() + seamlessLoop.duration() * 10);
	scrub.pause(); // otherwise it may update the totalTime right before the trigger updates, making the starting value different than what we just set above. 
	}
	trigger.wrapping = true;
	trigger.scroll(trigger.end - 1);
}

function scrubTo(totalTime) { // moves the scroll position to the place that corresponds to the totalTime value of the seamlessLoop, and wraps if necessary.
	let progress = (totalTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration();
	if (progress > 1) {
		wrapForward(trigger);
	} else if (progress < 0) {
		wrapBackward(trigger);
	} else {
		trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
	}
}

document.querySelector(".next").addEventListener("click", () => scrubTo(scrub.vars.totalTime + spacing));
document.querySelector(".prev").addEventListener("click", () => scrubTo(scrub.vars.totalTime - spacing));




function buildSeamlessLoop(items, spacing) {
	let overlap = Math.ceil(1 / spacing), // number of EXTRA animations on either side of the start/end to accommodate the seamless looping
		startTime = items.length * spacing + 0.5, // the time on the rawSequence at which we'll start the seamless loop
		loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the startTime 
		rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live
		seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
			paused: true,
			repeat: -1, // to accommodate infinite scrolling/looping
			onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
				this._time === this._dur && (this._tTime += this._dur - 0.01);
			}
		}),
		l = items.length + overlap * 2,
		time = 0,
		i, index, item;

	// set initial state of items
	gsap.set(items, {xPercent: 400, opacity: 0,	scale: 0});

	// now loop through and create all the animations in a staggered fashion. Remember, we must create EXTRA animations at the end to accommodate the seamless looping.
	for (i = 0; i < l; i++) {
		index = i % items.length;
		item = items[index];
		time = i * spacing;
		rawSequence.fromTo(item, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false}, time)
				   .fromTo(item, {xPercent: 400}, {xPercent: -400, duration: 1, ease: "none", immediateRender: false}, time);
		i <= items.length && seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
	}
	
	// here's where we set up the scrubbing of the playhead to make it appear seamless. 
	rawSequence.time(startTime);
	seamlessLoop.to(rawSequence, {
		time: loopTime,
		duration: loopTime - startTime,
		ease: "none"
	}).fromTo(rawSequence, {time: overlap * spacing + 1}, {
		time: startTime,
		duration: startTime - (overlap * spacing + 1),
		immediateRender: false,
		ease: "none"
	});
	return seamlessLoop;
}






