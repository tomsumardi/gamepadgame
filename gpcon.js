
/**
 * Main
 */

(function (window) {
    "use strict";

    // Imports
    let template = htmlLib.template;
    let qs = htmlLib.qs;
    
    // Currently visible controller
    let currentVisibleController = null;
    // BUTTON COUNTS must match avail buttons
    var AVAIL_BUTTONS = [0,1,2,3,12,13,13];
    var TESTCHAR_COUNT = AVAIL_BUTTONS.length;
    // my lazy RNG, this can be done better
    var RNG_VALUES = [0,1,2,3,12,13,0,1,2,3,12,13,0,1,2,3,12,13];

    function sequenceRng() {
        let rArray = []
        let array = RNG_VALUES;
        let currentIndex = array.length,  randomIndex;
      
        while (currentIndex != 0) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        for (let i=0; i < AVAIL_BUTTONS.length;i++) {
            rArray.push(array[i]); 
        }

        return rArray;
      }

    /**
     * Show a certain controller
     */
    function showController(n) {

        n = n | 0;

        console.log("Selecting gamepad " + n);

        let gamepads = document.querySelectorAll("#gamepad-container .gamepad");

        for (let i = 0; i < gamepads.length; i++) {
            let gp = gamepads[i];
            let index = gp.getAttribute("data-gamepad-index");

            index = index | 0;

            if (index == n) {
                gp.classList.remove('nodisp');
            } else {
                gp.classList.add('nodisp');
            }
        }

        currentVisibleController = n;
    }

    /**
     * Reconstruct the UI for the current gamepads
     */


    function rebuildUI(testSequnces) {

        let gp = navigator.getGamepads();

        let bbbox = qs("#button-bar-box");
        bbbox.innerHTML = '';

        let gpContainer = qs("#gamepad-container");
        gpContainer.innerHTML = '';

        let haveControllers = false, curControllerVisible = false, firstController = null;

        // For each controller, generate a button from the
        // button template, set up a click handler, and append
        // it to the button box
        for (let i = 0; i < gp.length; i++) {

            // Chrome has null controllers in the array
            // sometimes when nothing's plugged in there--ignore
            // them
            if (!gp[i] || !gp[i].connected) { continue; }

            let gpIndex = gp[i].index;

            // Clone the selector button
            let button = template("#template-button",
                {
                    "id": "button-" + gpIndex,
                    "data-gamepad-index": gpIndex,
                    "value": gpIndex
                });

            bbbox.appendChild(button);

            // Clone the main holder
            let gamepad = template("#template-gamepad",
                {
                    "id": "gamepad-" + gpIndex,
                    "data-gamepad-index": gpIndex
                });

            gpContainer.appendChild(gamepad);

            qs(".gamepad-title", gamepad).innerHTML = "Gamepad " + gpIndex;
            qs(".gamepad-id", gamepad).innerHTML = gp[i].id;

            let mapping = gp[i].mapping;
            qs(".gamepad-mapping", gamepad).innerHTML = "mapping: " + (mapping && mapping !== ''? mapping: "[<i>unspecified</i>]");

            // Add the buttons for this gamepad
            let buttonBox = qs(".gamepad-buttons-box", gamepad)
            let b;
            for (b = 0; b < testSequnces.length; b++) {
                let buttonContainer = template("#template-gamepad-button-container",
                {
                    "id": "gamepad-" + gpIndex + "-button-container-" + testSequnces[b].sequence + "-" + testSequnces[b].weight
                });

                qs(".gamepad-button", buttonContainer).setAttribute("id", "gamepad-" + gpIndex + "-button-" + testSequnces[b].sequence + "-" + testSequnces[b].weight);
                qs(".gamepad-button", buttonContainer).setAttribute("class","gamepad-button-" + testSequnces[b].sequence)
                //qs(".gamepad-button", buttonContainer)
                let btn = ''
                if (testSequnces[b].sequence== 0) {
                    btn = 'A';
                }
                else if (testSequnces[b].sequence== 1) {
                    btn = 'B';
                }
                else if (testSequnces[b].sequence== 2) {
                    btn = 'X';
                }
                else if (testSequnces[b].sequence== 3) {
                    btn = 'Y';
                }
                else if (testSequnces[b].sequence== 12) {
                    btn = 'up';
                }
                else if (testSequnces[b].sequence== 13) {
                    btn = 'down';
                }
                //qs(".gamepad-button-label", buttonContainer).innerHTML = btn;
                buttonBox.appendChild(buttonContainer);
            }

            // And remember that we have controllers now
            haveControllers = true;

            if (i == currentVisibleController) {
                curControllerVisible = true;
            }

            if (firstController === null) {
                firstController = i;
            }
        }

        // Show or hide the "plug in a controller" prompt as
        // necessary
        if (haveControllers) {
            qs("#prompt").classList.add("nodisp");
            qs("#main").classList.remove("nodisp");
        } else {
            qs("#prompt").classList.remove("nodisp");
            qs("#main").classList.add("nodisp");
        }

        if (curControllerVisible) {
            showController(currentVisibleController);
        } else {
            currentVisibleController = firstController;
            showController(firstController);
        }
        let btnIndex  = 0;

        return btnIndex;
    }

    function thirdPartyGamePadInit(gamepads) {
        var gamepadConfig = {
            axisThreshold: 0,
            indices: {
            'standard': {
                cursorX: 2,
                cursorY: 3,
                scrollX: 0,
                scrollY: 1,
                back: 9,
                forward: 8,
                vendor: 10,
                zoomIn: 5,
                zoomOut: 1
            },
            '46d-c216-Logitech Dual Action': {
                cursorX: 3,
                cursorY: 4,
                scrollX: 1,
                scrollY: 2,
                back: 8,
                forward: 9,
                vendor: null,
                zoomIn: 7,
                zoomOut: 6
            },
            '79-6-Generic   USB  Joystick': {
                cursorX: null,
                cursorY: null,
                scrollX: 3,
                scrollY: 2,
                back: 6,
                forward: 7,
                vendor: null,
                zoomIn: 9,
                zoomOut: 8
            },
            keyEvents: {
                vendor: {
                detail: {
                    charCode: 0,
                    key: 'Escape',
                    keyCode: 27
                }
                }
            }
            }
        };

        console.log('Gamepads detected', Gamepads.hasGamepads());
        var gamepads = new Gamepads(gamepadConfig);
        window.gamepads = gamepads;
        gamepads.polling = false;

        if (gamepads.gamepadsSupported) {
            gamepads.updateStatus = function () {
                gamepads.polling = true;
                gamepads.update();
                window.requestAnimationFrame(gamepads.updateStatus);
            };
            
            gamepads.cancelLoop = function () {
                gamepads.polling = false;
            
                if (gamepads.pollingInterval) {
                window.clearInterval(gamepads.pollingInterval);
                }
            
                window.cancelAnimationFrame(gamepads.updateStatus);
            };
            
            window.addEventListener('gamepadconnected', function (e) {
                console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
                e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
            
                gamepads.updateStatus();
            });
            
            window.addEventListener('gamepaddisconnected', function (e) {
                console.log('Gamepad removed at index %d: %s.', e.gamepad.index, e.gamepad.id);
            });
        }
    }

    function initDataStructure(testSequnces) {
        let sqs = sequenceRng();
        let bw =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        let btn;
        for (let b=0; b < sqs.length; b++) {
            if (sqs[b] == 0) {
                btn = 'A';
                bw[sqs[b] ] +=1;
            }
            else if (sqs[b] == 1) {
                btn = 'B';
                bw[sqs[b] ] +=1;
            }
            else if (sqs[b] == 2) {
                btn = 'X';
                bw[sqs[b] ] +=1;
            }
            else if (sqs[b] == 3) {
                btn = 'Y';
                bw[sqs[b] ] +=1;
            }
            else if (sqs[b] == 12) {
                btn = 'up';
                bw[sqs[b] ] +=1;
            }
            else if (sqs[b] == 13) {
                btn = 'down';
                bw[sqs[b] ] +=1;
            }
        }
        testSequnces = []
        for (let i=0; i < sqs.length; i++) {
            let w = bw[sqs[i]];
            //console.log(w)
            testSequnces.push({
                "sequence" : sqs[i],
                "weight" : w
            });
            bw[sqs[i]] = w-1;
        }

        //console.log(bw)
        //console.log(testSequnces)
        
        return testSequnces
    }

    function onFrame(testSequnces, btnIndex) {
        let conCheck = gpLib.testForConnections();
        // Check for connection or disconnection
        if (conCheck) {
            let sequenceCount = 0;
            let testCount = 0;
            let seconds = 0;
            let startDate;
            let endDate;
            let error = false;
            let buttonElem;
            let testSequnces = initDataStructure(AVAIL_BUTTONS);
            btnIndex = rebuildUI(testSequnces);
            if (gamepads.nonstandardEventsEnabled) {
                window.addEventListener('gamepadbuttondown', function (e) {
                    let reset = false;
                    let measuretime = false;
                    let gpElem = qs("#gamepad-" + btnIndex);
                    let buttonBox = qs(".gamepad-buttons-box", gpElem);
                    let timeTextElem = qs("#gamepad-time-text")
                    let resultTextElem = qs("#gamepad-result-text")
                    let readyButtonElem = qs("#gamepad-ready-button-container")
                    if (sequenceCount < TESTCHAR_COUNT) {
                        //console.log('Gamepad button down at index %d: %s. Button: %d.',e.gamepad.index, e.gamepad.id, e.button);
                        //console.log("#gamepad-" + btnIndex + "-button-" + e.button + "-" + testSequnces[sequenceCount].weight);
                        buttonElem = qs("#gamepad-" + btnIndex + "-button-" + e.button + "-" + testSequnces[sequenceCount].weight, buttonBox);
                    }
                    if (e.button == 4 || e.button == 5 || e.button == 6 || e.button == 7) {
                        reset = true;
                        console.log('resetting');
                        readyButtonElem.style.backgroundColor = 'grey';
                    }
                    else {
                        if (sequenceCount == 0) {
                            startDate = new Date();
                        }
                        if (sequenceCount < TESTCHAR_COUNT) {
                            if (testSequnces[sequenceCount].sequence == e.button) {
                                buttonElem.classList.add("pressed");
                                //buttonElem.innerHTML = 1;
                                sequenceCount +=1;
                                //console.log(sequenceCount);
                                readyButtonElem.style.backgroundColor = 'yellow';
                            }
                            else {
                                console.log('error reset');
                                testCount +=1;
                                resultTextElem.append(testCount +">>"+"error!"+ "   "+"|"+"    ")
                                reset = true;
                                measuretime = true;
                                readyButtonElem.style.backgroundColor = 'red';
                            }
                        }
                        if (sequenceCount == TESTCHAR_COUNT) {
                            console.log('success!!');
                            testCount +=1;
                            resultTextElem.append(testCount +">>"+"success!"+ "   "+"|"+"    ")
                            sequenceCount +=1;
                            measuretime = true;
                            readyButtonElem.style.backgroundColor = 'green';
                        }
                        else if (sequenceCount > TESTCHAR_COUNT) {
                            console.log('success and reset !!');
                            reset = true;
                            readyButtonElem.style.backgroundColor = 'yellow';
                        }
                        if (measuretime) {
                            endDate = new Date();
                            seconds = (endDate.getTime() - startDate.getTime()) / 1000;
                            timeTextElem.append(testCount +">>"+seconds + " secs" + "   "+"|"+"    ");
                        }
                    }
                    if (reset) {
                        sequenceCount = 0;
                        testSequnces = initDataStructure(AVAIL_BUTTONS);
                        btnIndex = rebuildUI(testSequnces);
                        //console.log(testSequnces)
                    }
                });
                // Not being used for button release
                window.addEventListener('gamepadbuttonup', function (e) {
                    let gpElem = qs("#gamepad-" + btnIndex);
                    let buttonBox = qs(".gamepad-buttons-box", gpElem);
                    //console.log('Gamepad button up at index %d: %s. Button: %d.', e.gamepad.index, e.gamepad.id, e.button);
                });
            }
        }
        requestAnimationFrame(function () { onFrame(testSequnces, btnIndex)});
    }

    function onLoad() {
        if (gpLib.supportsGamepads()) {
            let testSequnces = initDataStructure(AVAIL_BUTTONS);
            let btnIndex = rebuildUI(testSequnces);
            requestAnimationFrame(function () { onFrame(testSequnces, btnIndex)});
        } else {
            qs("#sol").classList.remove("nodisp");
        }
    }

    // Main function entry /////
    thirdPartyGamePadInit();
    window.addEventListener('load', onLoad);

})(window);

