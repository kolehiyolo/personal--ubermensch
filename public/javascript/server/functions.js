let lorem = `What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

Where does it come from?
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

Where can I get some?
There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`;

let global = {};

global.buildParagraphs = (string) => {
    // let result;
    // let result = [];

    result = `<p>${string.replace(/\r\n\r\n/gi,'</p><p>')}</p>`

    return result;
}

global.buildSamples = (count) => {
    console.log(`buildSamples(${count})`);
    let result = [];

    function getRandomInt() {
        return Math.floor(Math.random() * (3000 - 0) + 0);
    }

    for (let i = 0; i < count; i++) {
        let loremBorders = [getRandomInt(), getRandomInt()].sort((a, b) => a - b);

        let postTemp = {
            id: i,
            date: `2022, Feb ${i+1}`,
            title: `Test Post ${i+1}`,
            content: lorem.slice(loremBorders[0], loremBorders[1]),
            link: `/post/${i}`
        };

        postTemp.thumb = ellipsize(postTemp.content);
        result.push(postTemp);
    }

    return result;
}

global.ellipsize = (text) => {
    console.log(`ellipsize(${text})`);
    let result = ``;
    let limit = 150;

    if (text.length > limit) {
        result = text.slice(0, limit) + `...`;
    } else {
        result = text;
    }

    console.log(`result = ${result}`);
    return result;
};

global.stringifyDate = (year, month, date) => {
    function getMonthString(month) {
        // This returns the string equivalent of a month
        return (month === 0) ? `January` :
            (month === 1) ? `February` :
            (month === 2) ? `March` :
            (month === 3) ? `April` :
            (month === 4) ? `May` :
            (month === 5) ? `June` :
            (month === 6) ? `July` :
            (month === 7) ? `August` :
            (month === 8) ? `September` :
            (month === 9) ? `October` :
            (month === 10) ? `November` :
            `December`;
    }

    function cardinalize(date) {
        let rem = date % 10;

        let suffix = (rem === 1 && date != 11) ? `st` :
            (rem === 2 && date != 12) ? `nd` :
            (rem === 3 && date != 13) ? `rd` :
            `th`;

        return `${date}${suffix}`;
    }

    return `${getMonthString(month)} ${cardinalize(date)}, ${year}`;
}

global.codifyDate = (year, month, date) => {
    month++;
    return `${year}-${(month<9)?`0`+month:month}-${(date<10)?`0`+date:date}`;
}

global.stringifyTime = (hours, minutes, seconds, timezone) => {
    // let expected = `11:12:53`;
    // `${hours}:${minutes}:${seconds}`

    hours = (hours < 9) ? `0` + hours : hours;
    minutes = (minutes < 9) ? `0` + minutes : minutes;
    seconds = (seconds < 9) ? `0` + seconds : seconds;

    return `${hours}:${minutes}:${seconds}`;
}

global.codifyTime = (hours, minutes, seconds, timezone) => {
    let expected = `07:12:53 PM GMT+8`;

    let meridiem;

    if (hours > 12) {
        meridiem = `PM`;
        hours = hours - 12;
    } else {
        meridiem = `AM`;
    }

    hours = (hours < 9) ? `0` + hours : hours;
    minutes = (minutes < 9) ? `0` + minutes : minutes;
    seconds = (seconds < 9) ? `0` + seconds : seconds;
    timezone = (timezone >= 0) ? `+` + timezone : timezone;

    return `${hours}:${minutes}:${seconds} ${meridiem} GMT${timezone}`;
}


module.exports = {
    // buildSamples: global.buildSamples,
    buildParagraphs: global.buildParagraphs,
    ellipsize: global.ellipsize,
    codifyDate: global.codifyDate,
    stringifyDate: global.stringifyDate,
    codifyTime: global.codifyTime,
    stringifyTime: global.stringifyTime,
}