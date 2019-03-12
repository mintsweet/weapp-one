const HP_AND_READING_BEGIN_TIME = '2012-10';
const MUSIC_BEGIN_TIME = '2016-01';
const MONTH_MAP = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.',
                   'Jul.', 'Aug.', 'Sep.', 'Otc.', 'Nov.', 'Dec.'];

const formatHpMakettime = (dateString) => {
    return dateString.split(' ')[0].replace(/\-/g, '  /  ');
}

const formatHpAuthor = (authorString) => {
    return authorString.split(' ')[0].replace(/\＆/, ' | ');
}

const formatHpContent = (contentString) => {
    return contentString.split(' ')[0];
}

const filterContent = function (string) {
    return string.replace(/[\r\n]/g, "").replace(/<.*?>/g, "\n");
}

const getBeginTime = (type) => {
    let beginTime = type === 'music'? MUSIC_BEGIN_TIME : HP_AND_READING_BEGIN_TIME;
    return new Date(beginTime);
}

const getDateList = (type) => {
    let begin = getBeginTime(type);
    let beginYear = begin.getFullYear();
    let beginMonth = begin.getMonth();

    let now = new Date();
    let nowYear = now.getFullYear();
    let nowMonth = now.getMonth();

    let dateList = [];
    for (let year = nowYear; year >= beginYear; year--) {
        for (let month = 11; month >=0; month--) {
            dateList.push({
                title: MONTH_MAP[month] + year,
                value: year + '-' + (month + 1)
            });
        }
    }

    dateList = dateList.slice(11 - nowMonth + 1, dateList.length - beginMonth);
    dateList.splice(0, 0, {
        title: '本月',
        value: nowYear + '-' + (nowMonth + 1)
    });
    return dateList;
}

const formatHpsTitle = () => {
    let now = new Date();
    let nowYear = now.getFullYear();
    let nowMonth = now.getMonth();
    return MONTH_MAP[nowMonth] + nowYear;
}

const formatHpListTime = (dateString) => {
    let dateArr = (new Date(dateString)).toString().split(' ', 4).slice(1, 4);
    return dateArr[1] + ' ' + dateArr[0] + '.' + dateArr[2];
}

const getBeforeTime = (dateString) => {
    let date = new Date(dateString);
    let now = new Date();
    let hour = Math.floor((now - date) / (1000 * 60 * 60));
    let day = Math.floor((now - date) / (1000 * 60 * 60 * 24));;

    if (hour < 24) {
        return hour + ' 小时前';
    } 

    if (day < 3) {
        return day + ' 天前';
    }

    return formatHpListTime(dateString);
}

module.exports = {
    formatHpMakettime,
    formatHpAuthor,
    formatHpContent,
    filterContent,
    getDateList,
    formatHpsTitle,
    formatHpListTime,
    getBeforeTime
}