function dateLog() {
    const date = new Date();

    const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date);
    const dmy = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);

    return `${time} ${dmy}`;
}


function requestLog (req:any, res:any) {
    const time = dateLog();
    const type = req.method.toUpperCase();
    const path = req.originalUrl;
    const client = req.ip;
    const status = res.statusCode;

    const color = status >= 400 ? "31"
        : status >= 300 ? "33"
        : status >= 200 ? "34"
        : "0";

    console.log(`\x1b[${color}m█ \x1b[37m[ ${time} ]\x1b[32m ${client} [${type}] \x1b[${color}m${status}\x1b[37m '${path}'\x1b[0m`);
}

export { dateLog, requestLog };