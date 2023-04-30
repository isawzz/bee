
function animetest95() {
	dTable = mBy('dTable'); mClear(dTable); mFlexWrap(dTable);
	let els = animtestCreate(2, dTable, { w: 250, h: 250, bg: 'gold', margin: 10 });
	//animTo(els[0], { backgroundColor: 'red' }, { duration: 3000, delay: 1000 });
	animeTo(els[1], { bg: colorHex('red') }, { duration: 3000, callback: () => console.log('DONE anime!') });

}
function animetest96() {
	dTable = mBy('dTable');
	let hsl1 = `hsl(0, 100%, 50%)`; //`hsl()`
	let hsl2 = `hsl(180, 100%, 50%)`; //`hsl()`
	let rgb1 = `rgb(0, 0, 255)`; //`hsl()`
	let rgb2 = `rgb(0, 255, 0)`; //`hsl()`
	let c1 = `hsl(240, 100%, 20%)`; //`hsl()`
	let c2 = `hsl(240, 100%, 80%)`; //`hsl()`
	let els = animtestCreate(1, dTable, { filter: 'hue-rotate(0deg)', w: 250, h: 250, bg: '#ffff00', margin: 10 });
	animtestAnimate(els, { filter: 'hue-rotate(0deg)', bg: '#ff0000' }, { duration: 15000, delay: 1000 });
}
function animetest97() {
	dTable = mBy('dTable');
	let hsl1 = `hsl(240, 100%, 50%)`; //`hsl()`
	let hsl2 = `hsl(120, 100%, 50%)`; //`hsl()`
	let rgb1 = `rgb(0, 0, 255)`; //`hsl()`
	let rgb2 = `rgb(0, 255, 0)`; //`hsl()`
	let c1 = `hsl(240, 100%, 20%)`; //`hsl()`
	let c2 = `hsl(240, 100%, 80%)`; //`hsl()`
	let els = animtestCreate(2, dTable, { w: 25, h: 25, bg: c1, margin: 10 });
	animtestAnimate(els, { bg: c2, w: 100, h: 100 }, { duration: 5000, delay: 1000 });
}
function animetest_color() {
	let d = document.querySelector('#dTable');
	let d1 = document.createElement('div'); //mDiv(d, { background: rColor(), w: 40, h: 40, display: 'inline-block' },'box');
	d.appendChild(d1);
	d1.style.background = 'red';
	d1.style.width = '100px';
	d1.style.height = '100px';
	d1.id = 'box';

	anime({
		targets: '#box',
		translateX: 200,
		rotate: 45,
		opacity: .5,
		background: '#ffff00',
		delay: 1000,
	});
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
