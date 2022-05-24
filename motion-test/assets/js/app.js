(function () {
	"use strict";

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

		if (scrollProgress !== null) {
			clearTimeout(scrollProgress);
		}
		scrollProgress = setTimeout(function () {
			$('#scrollProgress').fadeOut();
		}, 500);
	});

	//motions
	var app = {
		init: () => {
			app.windowResize();
			window.addEventListener('resize', app.windowResize);
			app.animations.init();
		},
		WIDTH: window.innerWidth,
		HEIGHT: window.innerHeight,
		windowResize: () => {
			app.WIDTH = window.innerWidth;
			app.HEIGHT = window.innerHeight;
		},
		ANIMATION_DELAY: 0,
		animations: {
			init: () => {
				app.animations.settings();
				app.animations.textHoverMotion();
				app.animations.textPaintMotion();
				app.animations.textRotateMotion();
				app.animations.textInvertMotion();
			},
			settings: () => {
				gsap.registerPlugin(ScrollTrigger);
				ScrollTrigger.defaults({
					start: "top top"
				})
			},

			//text-hover-motion
			textHoverMotion: () => {
				const textHoverArea = document.querySelector(".text-hover-motion");

				textHoverArea.addEventListener("mousemove", evt => {
					const mouseX = evt.clientX;
					const mouseY = evt.clientY;
					gsap.set(".text-hover-motion .cursor", {
						x: mouseX,
						y: mouseY
					})

					gsap.to(".text-hover-motion .circle", {
						x: mouseX,
						y: mouseY,
						stagger: -0.1 //순차적(시간 차)
					})
				})
			},

			//text-paint-motion
			textPaintMotion: () => {
				let tl = gsap.timeline({
					scrollTrigger: {
						trigger: ".text-paint-motion .painted",
						scrub: 0.3,
						start: "top 40%",
						end: "top 20%",
					}
				});
				tl.to(".text-paint-motion .painted", {
					clipPath: "inset(0% 0% 0% 0%)",
					duration: 1,
					ease: 'none',
					stagger: 1
				})
			},
			
			//text-rotate-motion
			textRotateMotion: () => {

				gsap.set('.text-rotate-motion .motion-section', {
					height: gsap.getProperty('.text-rotate-motion .text-wrap', 'height')
				});
				window.addEventListener('scroll', (e) => {
					let scrollY = -e.currentTarget.scrollY,
						scrollProgress = scrollY / (window.innerHeight - gsap.getProperty('.text-rotate-motion .motion-section', 'height'));

					gsap.timeline({
							defaults: {
								duration: 0.8,
								ease: 'sine.out'
							}
						})
						.to('.text-rotate-motion .text-wrap', {
							y: scrollY
						}, 0)
						.to('.text-rotate-motion .text-item', {
							rotationY: (i) => {
								return scrollProgress * -360
							},
							transformPerspective: 600,
							stagger: 0.05
						}, 0)
				});
			},

			//text-invert-motion
			textInvertMotion: () => {
				const textInvertItems = gsap.utils.toArray(".text-invert-motion .motion-section");

				textInvertItems.forEach(item => {
					let tl = gsap.timeline({
						scrollTrigger: {
							trigger: textInvertItems,
							start: "center center",
							end: () => "+=" + item.offsetWidth,
							scrub: true,
							pin: true,
							anticipatePin: 1
						},
						defaults: {
							ease: "none"
						}
					});
					tl.fromTo(item.querySelector(".text-invert-motion .after"), {
							xPercent: 100,
							x: 0
						}, {
							xPercent: 0
						})
						.fromTo(item.querySelector(".text-invert-motion .after .mask"), {
							xPercent: -100,
							x: 0
						}, {
							xPercent: 0
						}, 0);
				});
			}
		}
	}
	app.init()
}())