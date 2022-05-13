gsap.registerPlugin(ScrollTrigger);
let SECTIONS = gsap.utils.toArray("section");

gsap.to(SECTIONS, {
	xPercent: -100 * (SECTIONS.length - 1),
	ease: "none",
	scrollTrigger: {
		trigger: '#container',
		end: () => "+=" + document.querySelector("#container").offsetWidth,
		pin: true,
		scrub: 1,
		snap: 1 / (SECTIONS.length - 1),
	}
});


