
function animetest_color() {
	let d = document.querySelector('#table');
	let d1 = document.createElement('div'); //mDiv(d, { background: rColor(), w: 40, h: 40, display: 'inline-block' },'box');
	d.appendChild(d1);
	d1.style.background='red';
	d1.style.width='100px';
	d1.style.height='100px';
	d1.id='box';

	anime({
		targets: '#box',
		translateX: 200,
		rotate: 45,
		opacity: .5,
		background: '#ffff00',
		//backgroundColor: 'blue',
		delay: 1000,
	});
}





function _animetest_color() {
	let d = document.querySelector('#table');
	console.log('d', d);

	let d1 = mDiv(d, { bg: rColor(), w: 40, h: 40, display: 'inline-block' });
	let [x, y] = [100, 200]
	// d1.animate([
	// 	{ transform: `translate(${x}px,${y}px)` },
	// ], {
	// 	easing: 'ease',
	// 	duration: 1000,
	// 	fill: 'forwards'
	// });
	anime({targets:d1,transform: `translate(${x}px,${y}px)`});

	return;

	let alist = [];
	for (const i of range(10)) {
		let el = mShape('sq', d, { bg: rColor(), w: 40, h: 40 });
		let a = anime({ targets: el, translateX: 200 })
	}

}
function _animetest_color() {
	var colorTestEls = document.querySelectorAll('.color-test');


	function createTest(el) {
		var testHtml = el.innerHTML;
		var testValues = testHtml.split('<br>▾<br>');
		var colorEl = document.createElement('div');
		colorEl.classList.add('color-el');
		el.appendChild(colorEl);
		anime({
			targets: colorEl,
			backgroundColor: [testValues[0], testValues[1]],
			scale: [0.97, 0.75],
			direction: 'alternate',
			easing: 'easeInOutSine',
			duration: 4000,
			loop: true,
		});
	}

	for (var i = 0; i < colorTestEls.length; i++) createTest(colorTestEls[i]);

}
function _animetest_color() {
	let n = 4;
	let dParent = document.querySelectorAll('.color-tests')[0];
	console.log('dParent', dParent, '\n', n)

	function createTest(i, dParent) {
		// var testHtml = el.innerHTML;
		// var testValues = ['#ff0000', '#ffff00']; // testHtml.split('<br>▾<br>');

		let d0 = document.createElement('div'); d0.classList.add('color-test');
		dParent.appendChild(d0);

		var el = document.createElement('div'); el.classList.add('color-el');
		d0.appendChild(el);

		var hue = Math.round((360 / n) * i);
		let c0 = el.style.backgroundColor = '#0000ff'; // 'hsl(' + hue + ', 50%, 50%)';
		anime({
			targets: el,
			backgroundColor: [c0, '#ff0000'],
			scale: [0.97, 0.75],
			direction: 'alternate',
			easing: 'easeInOutSine',
			duration: 4000,
			loop: true,
		});
	}

	for (var i = 0; i < n; i++) createTest(i, dParent);

}
function animetest_easing() {
	const easingVisualizerEl = document.querySelector('.easing-visualizer');
	const barsWrapperEl = easingVisualizerEl.querySelector('.bars-wrapper');
	const dotsWrapperEl = easingVisualizerEl.querySelector('.dots-wrapper');
	const barsFragment = document.createDocumentFragment();
	const dotsFragment = document.createDocumentFragment();
	const numberOfBars = 101;

	for (let i = 0; i < numberOfBars; i++) {
		const barEl = document.createElement('div');
		const dotEl = document.createElement('div');
		barEl.classList.add('bar');
		dotEl.classList.add('dot');
		dotEl.classList.add('color-red');
		barsFragment.appendChild(barEl);
		dotsFragment.appendChild(dotEl);
	}

	barsWrapperEl.appendChild(barsFragment);
	dotsWrapperEl.appendChild(dotsFragment);

	// anime.setValue('.easing-visualizer .dot', { translateX: anime.stagger(6) });

	function animateEasing() {

		const easings = [];
		for (let ease in anime.penner) easings.push(ease);
		easings.push('steps(' + anime.random(5, 20) + ')');
		easings.push('cubicBezier(0.545, 0.475, 0.145, 1)');
		const ease = easings[anime.random(0, easings.length - 1)];
		const duration = 450;

		anime.timeline({
			complete: animateEasing,
			easing: ease,
			duration: duration
		})
			.add({
				targets: '.easing-visualizer .bar',
				scaleY: anime.stagger([1, 100], { easing: ease, from: 'center', direction: 'reverse' }),
				delay: anime.stagger(14, { from: 'center' })
			})
			.add({
				targets: '.easing-visualizer .dot',
				translateY: anime.stagger(['-6rem', '6rem'], { easing: ease, from: 'last' }),
				delay: anime.stagger(10, { from: 'center' })
			}, 0);

	}

	animateEasing();


}
function animetest_keyframes() {
	//document.body.innerHTML = `<div class="keyframes-visualizer"></div>`;

	const keyframesVisualizerEl = document.querySelector('.keyframes-visualizer');
	const fragment = document.createDocumentFragment();
	const numberOfElements = 256;

	for (let i = 0; i < numberOfElements; i++) {
		fragment.appendChild(document.createElement('div'));
	}

	keyframesVisualizerEl.appendChild(fragment);

	const animation = anime({
		targets: '.keyframes-visualizer div',
		keyframes: [
			{
				color: '#FF4B4B',
				translateX: anime.stagger('-.15rem', { grid: [16, 16], from: 'center', axis: 'x' }),
				translateY: anime.stagger('-.15rem', { grid: [16, 16], from: 'center', axis: 'y' }),
				duration: 300
			},
			{
				translateX: anime.stagger('.125rem', { grid: [16, 16], from: 'center', axis: 'x' }),
				translateY: anime.stagger('.125rem', { grid: [16, 16], from: 'center', axis: 'y' }),
				duration: 500
			}, {
				color: '#373535',
				translateX: 0,
				translateY: 0,
				duration: 600,
			}
		],
		delay: anime.stagger(2),
		easing: 'easeInOutQuad',
		loop: true
	});

	console.log(animation);

}
function test100(numberOfEls = 100) {
	var wrapperEl = document.body;
	var duration = numberOfEls * 10;
	var radius = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
	var distance = (radius / 4 <= 150 ? 150 : radius / 2.5) / 16;

	function createEl(i) {
		var el = document.createElement('div');
		var hue = Math.round((360 / numberOfEls) * i);
		el.classList.add('el');
		//el.style.border = '5px solid hsl(' + hue + ', 50%, 50%)';
		el.style.backgroundColor = 'hsl(' + hue + ', 50%, 50%)';
		wrapperEl.appendChild(el);
		let a = anime({
			targets: el,
			translateX: Math.sin(i) * distance + 'rem',
			translateY: Math.cos(i) * distance + 'rem',
			scale: [{ value: [0.1, 2] }, { value: 0.1 }],
			easing: 'easeInOutSine',
			loop: true,
			duration: duration,
			delay: i * (duration / numberOfEls),
		});
		return a;
	}

	let anis = [];
	for (var i = 0; i < numberOfEls; i++) anis.push(createEl(i));

	var isRunning = true;
	onclick = () => {
		if (isRunning) {
			anis.map((x) => x.pause());
			isRunning = false;
		} else {
			anis.map((x) => x.play());
			isRunning = true;
		}
	};

}
