const print = (data) => console.log(data);
const chalk = require("chalk");
help = (data, not = true) => {
    let commands = "";
    let _options = [];
    let options = "";
    Object.keys(data.methods).forEach(m => {
        const select = data.methods[m];
        const args = select.args.length === 0 ? "" : `[${select.args.join(" ")}]`;
        if (select.exclude !== true)
            commands += `  ${m} ${args} - ${select.help[0]}\n`;
        for (let i = 0; i < select.args.length; i++) {
            _options.push({name: select.args[i], help: select.help.slice(1)[i]})
        }
    });
    _options = _options.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i)
    _options.forEach(e => {
        options += `  ${e.name} - ${e.help}\n`
    });
    first = not ? chalk.red("Command not found.") : `${data.name} (Version:${data.version})`;
    print(` ${first}
===================================================
Usage: ${data.alias} command [options]

${data.description}

Available Commands:
${commands}
Available Options:
${options}`)
};
exports.parse = (argtable, args) => {

    const fetch = argtable.methods[args[0]];


    if (fetch === undefined) {
        help(argtable, args[0] !== 'help');
    } else {
        let values = {};
        args = args.slice(1);

        if (args.length < fetch.args.length) {
            print(chalk.red(`Missing arguments : ${fetch.args.join(",")}`))
        } else {
            if (argtable.allowExtraTags) {
                fetch.func(args);
                return
            }

            for (let i = 0; i < args.length; i++) {
                values[fetch.args[i]] = args[i]
            }
            fetch.func(values);
        }

    }

};

exports.progress = [
    "|/-\\",
    "⠂-–—–-",
    "◐◓◑◒",
    "◴◷◶◵",
    "◰◳◲◱",
    "▖▘▝▗",
    "■□▪▫",
    "▌▀▐▄",
    "▁▃▄▅▆▇█▇▆▅▄▃",
    "←↖↑↗→↘↓↙",
    "┤┘┴└├┌┬┐",
    "◢◣◤◥",
    ".oO°Oo.",
    ".oO@*",
    "◡◡ ⊙⊙ ◠◠",
    "☱☲☴",
    "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏",
    "⠋⠙⠚⠞⠖⠦⠴⠲⠳⠓",
    "⠄⠆⠇⠋⠙⠸⠰⠠⠰⠸⠙⠋⠇⠆",
    "⠋⠙⠚⠒⠂⠂⠒⠲⠴⠦⠖⠒⠐⠐⠒⠓⠋",
    "⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠴⠲⠒⠂⠂⠒⠚⠙⠉⠁",
    "⠈⠉⠋⠓⠒⠐⠐⠒⠖⠦⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈",
    "⠁⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈⠈",
    "⢄⢂⢁⡁⡈⡐⡠",
    "⢹⢺⢼⣸⣇⡧⡗⡏",
    "⣾⣽⣻⢿⡿⣟⣯⣷",
    "⠁⠂⠄⡀⢀⠠⠐⠈"];
exports.request = (URL, options) => {
    const axios = require("axios");
    const constants = require("./Constants");
    const Conf = require("conf");
    const config = new Conf({configName: constants.configName});
    const user = config.get(constants.userData, {token: '123'});

    if (URL.startsWith(constants.BASE_URL)) {
        if (user !== null && user !== undefined)
            options.headers = {
                wisdx: user.token
            }
    } else {
        if (options.sendHeaders) {
            options.headers = {
                userId: user.id
            }
        }
    }
    const Spinner = require("cli-spinner").Spinner;
    var spinner = new Spinner(`${options.prefix || ''} %s `);
    spinner.setSpinnerString(exports.progress[Math.floor(Math.random() * exports.progress.length)]);
    spinner.start();
    axios(URL, options)
        .then(data => {
            spinner.stop(true);
            options.callback(data.data);
        })
        .catch(err => {
            spinner.stop(true);
            if (options.errorcallBack !== undefined) {
                options.errorcallBack(err);
                return
            }
            if (err.response !== undefined && err.response.status === 401) {
                console.error(chalk.red("  Looks like your token is expired please re-login by typing [kpm relogin]."))
            } else if (err.isAxiosError) {
                console.error(options.errorMessage || "Please check your internet connection.");
            } else {
                console.log(err);
            }
        })

};

exports.makeTable = (data) => {
    const Table = require("cli-table3");
    if (data.length === 0) return;
    const table = new Table({
        head: Object.keys(data[0])
    });
    data.forEach(e => {
        let row = [];
        Object.keys(e).forEach(r => row.push(e[r]));
        table.push(row);
    });
    console.log(table.toString());
};
exports.isEmptyObject = (obj) => {
    return !!Object.keys(obj).length;
};
exports.makeItem = (param, options = {boxen: true, lolcat: true}) => {
    const boxen = require("boxen");
    let data = "";
    Object.keys(param).forEach(e => {
        data += `-> ${e} : ${param[e]}\n`
    });
    if (options.boxen) data = boxen(data, {padding: 1});
    if (options.lolcat) require("./lolcat").fromString(data);
    else console.log(data);

};
exports.getDb = (alias) => {
    const Config = require("conf");
    return new Config({configName: alias});
};

exports.lolcat = () => {
    return require("./lolcat")
};
