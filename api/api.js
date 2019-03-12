const perfix = "http://v3.wufazhuce.com:8000/api/";
const wxRequest = (params, url) => {
    wx.showLoading({
        title: "Loading...",
    });
    wx.request({
        url: url,
        data: params.data || '',
        header: {
            'content-type': 'application/json'
        },
        method: params.method || 'GET',
        success: (res) => {
            params.success && params.success(res);
            wx.hideLoading();
        },
        fail: (res) => {
            params.fail && params.fail(res);
        },
        complete: (res) => {
            params.complete && params.complete(res);
        }
    });
}

// home
const getHpIdList = (params) => wxRequest(params, perfix + 'hp/idlist/0');
const getHpDetailById = (params) => wxRequest(params, perfix + 'hp/detail/' + params.query.id);
const getHpByMonth = (params) => wxRequest(params, perfix + 'hp/bymonth/' + params.query.month);

// read
const getReadingCarousel = (params) => wxRequest(params, perfix + 'reading/carousel');
const getReadingCarouselById = (params) => wxRequest(params, perfix + 'reading/carousel/' + params.query.id);
const getReadingIndex = (params) => wxRequest(params, perfix + 'reading/index');
const getEssayById = (params) => wxRequest(params, perfix + 'essay/' + params.query.id);
const getSerialById = (params) => wxRequest(params, perfix + 'serialcontent/' + params.query.id);
const getQuestionById = (parmas) => wxRequest(parmas, perfix + 'question/' + parmas.query.id);
const getArticleByMonth = (params) => wxRequest(params, perfix + params.query.type + '/bymonth/' + params.query.month);

// music
const getMusicIdList = (parmas) => wxRequest(parmas, perfix + 'music/idlist/0');
const getMuiscById = (parmas) => wxRequest(parmas, perfix + 'music/detail/' + parmas.query.id);
const getMusicByMonth = (parmas) => wxRequest(parmas, perfix + 'music/bymonth/' + parmas.query.month);

// movie
const getMovieList = (parmas) => wxRequest(parmas, perfix + 'movie/list/0');
const getMovieById = (parmas) => wxRequest(parmas, perfix + 'movie/detail/' + parmas.query.id);
const getMovieStoryById = (parmas) => wxRequest(parmas, perfix + 'movie/' + parmas.query.id + '/story/1/0');

//comment
const getCommentList = (params) => wxRequest(params, perfix + 'comment/praiseandtime/' + params.query.type + '/' + params.query.id + '/0');

// address
const getAddress = (params) => wxRequest(params, 'http://apis.map.qq.com/ws/location/v1/ip?key=' + params.query.key);

module.exports = {
    getHpIdList,
    getHpDetailById,
    getHpByMonth,
    getReadingCarousel,
    getReadingCarouselById,
    getReadingIndex,
    getEssayById,
    getSerialById,
    getQuestionById,
    getArticleByMonth,
    getMusicIdList,
    getMuiscById,
    getMusicByMonth,
    getMovieList,
    getMovieById,
    getMovieStoryById,
    getCommentList,
    getAddress
}