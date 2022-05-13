	//scroll progress
	var scrollTimer = null;

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
		if (scrollTimer !== null) {
			clearTimeout(scrollTimer);
		}
		scrollTimer = setTimeout(function () {
			$('#scrollProgress').fadeOut();
		}, 500);
	});

	//text-hovver-motion
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







