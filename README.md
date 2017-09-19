ezSlots
=======
ezSlots is a trivially simple JQuery "Slot Machine Construction Kit". Its only dependencies are jQuery and the jQuery Easing library. It can be allowed to run randomly or to go to a pre-specified "winning" combo, can have any number of wheels, and use any set of symbols (HTML characters, images, etc)

It is designed as an educational tool / sample as well as a "ready to go" piece of technology to add some slots to any page. There are other, fancier jQuery slot machines out there (including the ability to keep spinning indefinitely, which ezSlots does not have) but by keeping the code base to under 100 lines, ezSlots is meant to be easy to understand and customize.

Minimal Usage
-----
    <link href="ezslots.css" rel="stylesheet" type="text/css" />
    <script src="jquery-1.11.3.js"></script>
    <script src="jquery.easing.1.3.js"></script>
    <script src="ezslots.js"></script>
    <script>
    $(document).ready(function(){
       var slotMachine = new EZSlots("elementid",{});
       var results = slotMachine.spin(); //.win() would force "winning" spin    
     });
    </script>
    <div id="elementid"></div>

Options
-------
The first argument is the id of a div existing on the page.

The second argument is a map with the following keys:

 - reelCount - how many reels/windows to display (default:3)
 - symbols - an array containing html strings (or an array of arrays if you want different symbol sets for each reel) (default:['A','B','C']
 - winningSet - an optional array specifying the offset of a "winning" spin. (For example, if the first entry in the symbols array was the "winner", this should be [0,0,0]) (default: none. If you want to call .win() this should be explicitly set)
 - startingSet - an optional array specifying the offset when the slots first appear. (default:none, so just random entries)
 - width - width of each slot window in pixels (default: 100)
 - height - height of each slot window in pixels (default: 100)
 - callback - optional function to be called upon completion of animation (approximately). Will be passed the results.

Samples
-------
There is a [sample page](http://kirkdev.alienbill.com/ezslots/sample.html) where you can see the "all defaults version", one with simple text numbers, one with images, and one that uses mixed type. The mixed type example uses a callback function to show a JSON stringified version of the results.

Understanding the Code
----------------------
The code starts with the pattern as storing "this" in a private variable "that". It then sets member variables with a mix of values from the options map and hard-wired defaults.

The init function is defined but only called once the other member functions are set. It creates the appropriate number of window/reels.

The CSS suggest the structure ezslots generates:

    .ezslots>.window>.slider>.symbol>.content

* ezslots - a class assigned to the containing div
* window - refers one of the reel-viewing windows
* slider - this is the part that actually moves.
* symbol - container for a single symbol that will show up in the window
* content - where the symbol actually "lives" (needed for horizontal and vertical centering)

Heights and width are manually and redundantly applied to ensure consistency with the animation.

Also, each reel window is given the class "window_#" where # is its position in the ezslots div.

For the animation effect, 20 symbols are added to each window (randomly selected from the array of options for that reel, except possibly for the "winning" result that actually shows up in the window when things come to rest) and an "easeOutElastic" easing gives the illusion of a rotating reel that then settles into place.

With a regular or guaranteed win, the results are return an array of offsets into the array of "possibilities." There's currently no function provided for translating these offsets into the html strings being displayed, but it would be trivial to write if needed.