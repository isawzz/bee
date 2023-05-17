
function createEl(i,dParent) {
	var el = document.createElement('div');
	var hue = Math.round((360 / numberOfEls) * i);
	el.classList.add('el');
	//el.style.border = '5px solid hsl(' + hue + ', 50%, 50%)';
	el.style.backgroundColor = 'hsl(' + hue + ', 50%, 50%)';
	dParent.appendChild(el);
	let a = anime({
		targets: el,
		translateX: Math.sin(i) * distance + 'rem',
		translateY: Math.cos(i) * distance + 'rem',
		scale: [{value: [0.1, 2]}, {value: 0.1}],
		easing: 'easeInOutSine',
		loop: true,
		duration: duration,
		delay: i * (duration / numberOfEls),
	});
	return a;
}














