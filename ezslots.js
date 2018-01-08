function EZSlots(id,useroptions){
	var that = this; //keep reference to function for use in callbacks
	//set some variables from the options, or with defaults.
	var options = useroptions ? useroptions : {};
	this.reelCount = options.reelCount ? options.reelCount : 3; //how many reels, assume 3 
	this.symbols = options.symbols ? options.symbols : ['A','B','C'];
	this.sameSymbolsEachSlot = true;
	this.startingSet = options.startingSet;
	this.winningSet = options.winningSet;
	this.width = options.width ? options.width : 100;
	this.height = options.width ? options.height : 100;
	this.time = options.time ? (options.time * 1000) : 6500; //time in millis for a spin to take	
	this.howManySymbolsToAppend = Math.round(this.time/325); //how many symbols each spin adds
	this.endingLocation = 7; //location for selected symbol... needs to be a few smaller than howManySymbolsToAppend
	this.jqo = $("#"+id); //jquery object reference to main wrapper
	this.jqoSliders = []; //jquery object reference to strips sliding up and down
	this.callback = options.callback; //callback function to be called once slots animation is finished

	//to initialize we construct the correct number of slot windows
	//and then populate each strip once
	this.init = function(){
		this.jqo.addClass("ezslots"); //to get the css goodness
		//figure out if we are using the same of symbols for each window - assume if the first 
		//entry of the symbols is not a string we have an array of arrays
		if(typeof this.symbols[0] != 'string'){
			this.sameSymbolsEachSlot = false;
		}
		//make each slot window
		for(var i = 0; i < this.reelCount; i++){
			var jqoSlider = $('<div class="slider"></div>');
			var jqoWindow = $('<div class="window window_"'+i+'></div>');
			this.scaleJqo(jqoWindow).append(jqoSlider); //make window right size and put slider in it
			this.jqo.append(jqoWindow); //add window to main div
			this.jqoSliders.push(jqoSlider); //keep reference to jqo of slider
			this.addSymbolsToStrip(jqoSlider,i, false, true); //and add the initial set 
		}
	};
	//convenience function since we need to apply width and height to multiple parts
	this.scaleJqo = function(jqo){
		jqo.css("height",this.height+"px").css("width",this.width+"px");
		return jqo;
	}
	//add the various symbols - but take care to possibly add the "winner" as the symbol chosen
	this.addSymbolsToStrip = function(jqoSlider, whichReel, shouldWin, isInitialCall){
		var symbolsToUse = that.sameSymbolsEachSlot ? that.symbols : that.symbols[whichReel];
		var chosen =  shouldWin ? that.winningSet[whichReel] : Math.floor(Math.random()*symbolsToUse.length);
		for(var i = 0; i < that.howManySymbolsToAppend; i++){
			var ctr = (i == that.endingLocation) ? chosen : Math.floor(Math.random()*symbolsToUse.length);
			if(i == 0 && isInitialCall && that.startingSet){
				ctr = that.startingSet[whichReel];
			}
			//we nest "content" inside of "symbol" so we can do vertical and horizontal centering more easily
			var jqoContent = $("<div class='content'>"+symbolsToUse[ctr]+"</div>");
			that.scaleJqo(jqoContent);
			var jqoSymbol = $("<div class='symbol'></div>");
			that.scaleJqo(jqoSymbol);
			jqoSymbol.append(jqoContent);
			jqoSlider.append(jqoSymbol);
		}
		return chosen;
	}
	//to spin, we add symbols to a strip, and then bounce it down
	this.spinOne = function(jqoSlider,whichReel,shouldWin){
		var heightBefore = parseInt(jqoSlider.css("height"), 10); 
		var chosen = that.addSymbolsToStrip(jqoSlider,whichReel,shouldWin);
		var marginTop = -(heightBefore + ((that.endingLocation) * that.height));
		jqoSlider.stop(true,true).animate(
			{"margin-top":marginTop+"px"},
			{'duration' : that.time + Math.round(Math.random()*1000), 'easing' : "easeOutElastic"});
		return chosen;
	}

	this.spinAll = function(shouldWin){
		var results = [];
		for(var i = 0; i < that.reelCount; i++){
				results.push(that.spinOne(that.jqoSliders[i],i,shouldWin));
			}

		if(that.callback) {
			setTimeout(function(){ 
					that.callback(results); 
				}, that.time);
		}

		return results;
	}

	this.init();
	return {
		spin : function(){
			return that.spinAll();
		},
		win : function(){
			return that.spinAll(true);
		}
	}
}


