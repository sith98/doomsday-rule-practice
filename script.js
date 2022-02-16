const languages = [
    ["Auto", navigator.language],
    ["Deutsch", "de"],
    ["English", "en"],
    ["普通话", "zh"],
    ["हिन्दी", "hi"],
    ["Español", "es"],
    ["Français", "fr"],
    ["عربى", "ar"],
    ["বাংলা", "bn"],
    ["Ру́сский", "ru"],
    ["Português", "pt"],
    ["Bahasa Indonesia", "id"],
]
const centuries = [1800, 1900, 2000, 2100];
const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
}
const $ = document.querySelector.bind(document);
const weekdayOptions = { ...dateOptions, weekday: "long" };
const init = () => {
    const button = $("#generate")
    const cheat = $("#cheat")
    const output = $("#output")
    const langSelect = $("#lang-select")
    const langInput = $("#lang")
    const withAudio = $("#audio")
    const withText = $("#text")
    const rate = $("#rate")
    let generate = true;
    let date = null;

    languages.map(([name, value]) => new Option(name, value)).forEach(o => langSelect.add(o))
    if (!langInput.value) {
        langInput.value = langSelect.value;
    }

    langSelect.addEventListener("change", evt => {
        langInput.value = langSelect.value;
    })

    const onClick = () => {
        const lang = langInput.value;
        if (generate) {
            date = randomDate();
            const text = date.toLocaleDateString(lang, dateOptions)
            output.innerHTML = withText.checked ? text : "";

            if (withAudio.checked) {
                const textToSpeech = new SpeechSynthesisUtterance(text);
                textToSpeech.lang = lang
                textToSpeech.rate = rate.value;
                window.speechSynthesis.speak(textToSpeech);
            }
        } else {
            output.innerHTML = date.toLocaleDateString(lang, weekdayOptions);
            if (withAudio.checked) {
                const textToSpeech = new SpeechSynthesisUtterance(date.toLocaleDateString(lang, { weekday: "long" }));
                textToSpeech.lang = lang
                textToSpeech.rate = rate.value;
                window.speechSynthesis.speak(textToSpeech);
            }
        }
        generate = !generate;
        button.innerHTML = generate ? "Generate" : "Reveal";
        cheat.style.display = !generate && !withText.checked ? "inline" : "none";
    }
    cheat.addEventListener("click", evt => {
        output.innerHTML = date.toLocaleDateString(lang.value, dateOptions);
    })

    button.addEventListener("click", onClick);
    window.addEventListener("keyup", evt => {
        if ([" ", "Enter"].includes(evt.key)) {
            onClick();
            evt.preventDefault();
        }
    });
}

const randomDate = () => {
    const possibleCenturies = centuries.filter(c => $(`#c${c}`).checked)
    const century = possibleCenturies[Math.floor(Math.random() * possibleCenturies.length)];
    const start = new Date(century, 0, 1);
    const end = new Date(century + 100, 0, 1);

    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


window.addEventListener("load", init)