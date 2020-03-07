function gameLoop() {
  var gamepad = navigator.getGamepads()[0]; //get the first controller.
  if (gamepad && gamepad.connected) {
    //check if direction buttons (UP, DOWN, LEFT, RIGHT) was pressed
    var axes = gamepad.axes;
    for (var i in axes) {
      if (axes[i] != 0) {
        print("axes[%s] value is: %s", i, axes[i]);
      }
    }
    // to check if other buttons(A,B,C,D,OK,Exit...) was pressed
    var buttons = gamepad.buttons;
    for (var i in buttons) {
      if (buttons[i].pressed == true) {
        print("buttons[%s] pressed", i);
      }
    }
  }
}

var game_loop;

//when controller connected, page will show: "Gamepad connected"
window.addEventListener("gamepadconnected", function(e) {
  print("Gamepad %s connected at %d", e.gamepad.id, e.gamepad.index);
  game_loop = setInterval(gameLoop, 50); //check if a button was pressed 20 times every second.
});

//when controller disconnected, page will show: "Gamepad disconnected"
window.addEventListener("gamepaddisconnected", function(e) {
  print("Gamepad %s disconnected", e.gamepad.id);
  clearInterval(game_loop); // stop checking
});
//end of the code.

//nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
// not about control keys
function print() {
  var args = ["== no string == "];
  for (var i in arguments) {
    args[i] = arguments[i];
  }
  var s = args[0],
    vs = args.slice(1);
  for (var i in vs) {
    s = s.replace(/%[a-z]/, vs[i]);
  }
  console.log(s);
}
