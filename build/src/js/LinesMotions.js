const Motions = {

	travel1: (options)=>{
		options.targetPoint[0] += (options.position[0] - options.targetPoint[0]) * .1;
		options.targetPoint[1] += (options.position[1] - options.targetPoint[1]) * .1;
		options.targetPoint[2] += (options.position[2] - options.targetPoint[2]) * .1;
	},

	travel2: (options)=>{
		options.targetPoint[0] += (options.position[0] - options.targetPoint[0]) * .1;
		options.targetPoint[1] += (options.position[1] - options.targetPoint[1]) * .1;
		options.targetPoint[2] += (options.position[2] - options.targetPoint[2]) * .1;
		options.targetPoint[0] +=  Math.cos(options.time/10 + Math.PI /4) * .08
		options.targetPoint[1] +=  Math.abs(Math.sin(options.time/10 + Math.PI /4) * .04)
	},

	travel3: (options)=>{
		options.targetPoint[0] += (options.position[0] - options.targetPoint[0]) * .1;
		options.targetPoint[1] += (options.position[1] - options.targetPoint[1]) * .1;
		options.targetPoint[2] += (options.position[2] - options.targetPoint[2]) * .1;
		options.targetPoint[1] += 	Math.sin(options.time/10) * .1
	},

	travelPair2:(options)=>{
		options.targetPoint[0] = options.position[0];
		options.targetPoint[1] = options.position[1];
		options.targetPoint[2] = options.position[2];

		let tickLeaving = Math.sin(options.time/10) * 10
		let tickLeaving2 = Math.cos(options.time/10) * 10
		options.targetPoint[0] -= tickLeaving * .1
	},

	travelPair1:(options)=>{
		options.targetPoint[0] = options.position[0];
		options.targetPoint[1] = options.position[1];
		options.targetPoint[2] = options.position[2];

		let tickLeaving = Math.sin(options.time/10) * 10
		let tickLeaving2 = Math.sin(options.time/20) * 10
		options.targetPoint[0] += tickLeaving * .1
	},

	basic: (options)=>{
		options.targetPoint[0] = options.position[0] + Math.cos(options.time/20 + options.startAngle) * options.radius;
		options.targetPoint[2] = options.position[2] + Math.sin(options.time/20 + options.startAngle) * options.radius;
	},

	circle: (options)=>{
		options.targetPoint[0] = options.position[0] + Math.cos(options.time/20 + options.startAngle) * options.radius;
		options.targetPoint[2] = options.position[2] + Math.sin(options.time/20 + options.startAngle) * options.radius;

		options.xoff += .01;
		options.yoff += .01;

		var p = options.perlin.perlin2(options.xoff, options.yoff)
		options.targetPoint[1] += p/20;
		options.targetPoint[1] += Math.sin(Math.tan(Math.cos(options.time/80 +options.startAngle) * 1.2)) * .01;
	},

	snake: (options)=>{
		options.targetPoint[0] = options.position[0] + Math.cos(options.time/40 + options.startAngle) * options.radius;
		options.targetPoint[2] = options.position[2] + Math.sin(options.time/50 + options.startAngle) * options.radius * 1.2 ;

		options.targetPoint[1] = options.position[1] - Math.abs(Math.sin(options.time / 100) * 4) - 2;
		options.targetPoint[0] += Math.cos(Math.pow(8, Math.sin(options.time/40 + options.startAngle))) * .5;
		options.targetPoint[1] += Math.sin(Math.pow(8, Math.sin(options.time/20 + options.startAngle))) * 1;
	},

	disappear1: (options, rand)=>{
		let getRandomPos = (r, s, t)=>{
			let x = r * Math.cos(s) * Math.sin(t)
			let y = r * Math.sin(s) * Math.sin(t)
			let z = r * Math.cos(t)

			return [x, y, z];
		}

		var angleA = Math.random() * Math.PI*2;
		var angleB = Math.random() * Math.PI*2;
		var r = Math.random() * .2 + .1;
		var posAdd = getRandomPos(r, angleA, angleB);

		return posAdd;
	},

	disappear2: (options, rand)=>{
		let getRandomPos = (r, s, t)=>{
			let x = r * Math.cos(s) * Math.sin(t)
			let y = r * Math.sin(s) * Math.sin(t)
			let z = r * Math.cos(t)

			return [x, y, z];
		}
		var angleA = Math.cos(options.time/10) * Math.PI * 2 + Math.PI * 2 * rand;
		var angleB = Math.cos(options.time/20) * Math.PI/2 + Math.PI + Math.PI * 2 * rand;
		var r = Math.random() * .1 + .01;

		return getRandomPos(r, angleA, angleB);
	}
}

export default Motions
