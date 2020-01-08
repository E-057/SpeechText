$(function () {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        var gameInstance = UnityLoader.instantiate("chat_space", "Build/AmadeusApi.json", { onProgress: UnityProgress });

        SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
        const recognition = new SpeechRecognition();

        var isActive = false;
        
        recognition.interimResults = true;

        $("#speech").on("click", function () {
            if ($(this).hasClass("off")) {
                return;
            }

            if (!isActive) {
                recognition.start();
            } else {
                recognition.stop();
            }
        })

        function startSettings() {
            $("#speech").css({ 'background-color': '#dd3030' });
            $(".interim_results").text("...");
        }

        function defaultSettings() {
            $("#speech").css({ 'background-color': '#666666' });
            $(".interim_results").text("...");
        }

        recognition.onstart = (event) => {
            isActive = true;
            startSettings();
            console.log("onstart");
        }

        recognition.onspeechstart = () => {
            console.log('onspeechstart');
            startSettings();
        }

        recognition.onresult = (event) => {
            $("#speech").css({ 'background-color': '#ff0505' });

            if (event.results[event.results.length - 1].isFinal) {
                gameInstance.SendMessage("Amadeus", "Amadeus", event.results[event.results.length - 1][0].transcript);

                startSettings();

                return;
            }

            $(".interim_results").text(event.results[event.results.length - 1][0].transcript);
        }

        recognition.onerror = (event) => {
            isActive = false;
            defaultSettings();
            console.log("onerror");
        }

        recognition.onend = (event) => {
            isActive = false;
            defaultSettings();
            console.log("onend");
        }
    } else {
        alert("No support");
    }
});

