
onload = start;

function start(){
test1();
}
function test1() {
	const boxesAnimation = anime({
		targets: '.js-box',
		translateY: [150, 50],
		backgroundColor: (el, i, t) => {
			const r = 58 + (i * 12);
			const g = 35 + (i * 12);
			const b = 220;
			const color = `rgb(${r}, ${g}, ${b})`;
			return color;
		},
		duration: 900,
		easing: 'easeOutElastic',
		elasticity: 500,
		delay: (el, i, t) => i * 20,
		loop: true,
		direction: 'alternate',
	});
}

function test0() {
	const boxesAnimation = anime({
		targets: '.js-box',
		translateY: [150, 50],
		backgroundColor: (el, i, t) => {
			const r = 58 + (i * 12);
			const g = 35 + (i * 12);
			const b = 220;
			const color = `rgb(${r}, ${g}, ${b})`;
			return color;
		},
		duration: 900,
		easing: 'easeOutElastic',
		elasticity: 500,
		delay: (el, i, t) => i * 20,
		loop: true,
		direction: 'alternate',
	});
}

