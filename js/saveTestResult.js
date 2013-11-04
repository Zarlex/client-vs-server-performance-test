/**
 * Created with JetBrains WebStorm.
 * User: zarges
 * Date: 06.07.13
 * Time: 14:43
 * To change this template use File | Settings | File Templates.
 */

var Test = function (saveResult, testAttrAmount, nextPage, step, interval, maxSteps, testId, testName) {
    this.saveResult = saveResult || false;
    this.testAttrAmount = testAttrAmount;
    this.step = parseInt(step) || 0;
    this.interval = parseInt(interval);
    this.maxSteps = parseInt(maxSteps) || 10;
    this.nextPage = nextPage || false;
    this.resultParams = [];
    this.testId = testId;
    this.testName = testName;
    if (this.testId === "false") {
        this.getTestId();

        localStorage.clear();
        localStorage.setItem("TEST_CURRENT", 0);
        var dbSize = 5 * 1024 * 1024; // 5MB
        var store = openDatabase("Test_DB", "1.0", "Render and db tests", dbSize);
        store.transaction(function (tx) {
            tx.executeSql("DROP TABLE User", []);
            tx.executeSql("DROP TABLE Tweet", []);
        });

        indexedDB.deleteDatabase('tweet');

    }
    var self=this;

    $(".success-test").hide();

    if(localStorage.getItem("TEST_BREAK")){
        $(".pause-test").hide();
        $(".continue-test").show();

    } else {
        $(".continue-test").hide();
        $(".pause-test").show();
    }
    $(".pause-test").on("click",function(ev){ self.pause.call(self,ev)})
    $(".continue-test").on("click",function(ev){ self.continue.call(self,ev)})

    this.setProgressbar();

}

Test.prototype.getTestId = function () {
    if (!this.saveResult) {
        this.nextPage += "&testid=none";
        this.testId = "none";
        return;
    }
    ;
    var self = this;
    $.ajax({
        url: '/tests/create',
        method: "POST",
        data: {
            name: this.testName,
            start: this.step,
            interval: this.interval,
            end: this.maxSteps
        },
        success: function (resp) {
            self.nextPage += "&testid=" + resp._id;
            self.testId = resp._id;
        }
    })
}

Test.prototype.addResult = function (result) {
    this.resultParams.push(result);
    console.log(this.resultParams.length, this.testAttrAmount, "JO", this.resultParams)
    if (this.resultParams.length === this.testAttrAmount) {

        this.save();
    } else {
        if (this.timeout)
            clearTimeout(this.timeout);

        if (this.save)
            this.timeout = setTimeout(function () {
                document.location.href = document.location.href;
            }, 60000);
    }
}

Test.prototype.save = function () {
    if (!this.saveResult) {
        //this.callNextPage();
        return;
    }
    var self = this;
    if (!this.testId) {
        setTimeout(function () {
            self.save();
        }, 200);

        return;
    }
    var params = {};

    for (var param in this.resultParams) {
        for (var param2 in this.resultParams[param]) {
            params[param2] = this.resultParams[param][param2];
        }
    }

    params.dataAmount = self.step;

    $.ajax({
        url: '/tests/save/' + this.testId,
        data: params,
        method: "POST",
        success: function (resp) {
            self.callNextPage.call(self);
        }
    })
}

Test.prototype.callNextPage = function () {
    var localStep = parseInt(localStorage.getItem("TEST_CURRENT")) || 0;
    if (this.timeout)
        clearTimeout(this.timeout);

    if(localStorage.getItem("TEST_BREAK"))
        return;

    if (this.step >= this.maxSteps || localStep >= this.maxSteps) {
        localStorage.removeItem("TEST_BREAK");
        localStorage.removeItem("TEST_CURRENT");
        this.setProgressbar();
        $(".continue-test").hide();
        $(".pause-test").hide();
        $(".success-test").show();
        $(".test-progress .bar").addClass("bar-success").css("width", "100%")
        return;
    }
    var nextPage = decodeURIComponent(this.nextPage);
    document.location.href = nextPage.search("http") < 0 ? "http://" + nextPage : nextPage
    localStorage.setItem("TEST_CURRENT", localStep + this.interval);
}

Test.prototype.setProgressbar = function () {
    var progress = (parseInt(localStorage.getItem("TEST_CURRENT")) / (this.maxSteps-1))*100 || 0
    $(".test-progress .bar").css("width", progress + "%")
    $(".test-progress").show();
    var localStep = parseInt(localStorage.getItem("TEST_CURRENT")) || 0;
    localStorage.setItem("TEST_CURRENT", localStep);
}

Test.prototype.pause=function(ev){
    localStorage.setItem("TEST_BREAK",this.nextPage);
    $(".continue-test").show();
    $(".pause-test").hide();
    this.setProgressbar();
}

Test.prototype.continue=function(ev){
    var nextPage=localStorage.getItem("TEST_BREAK");
    if(nextPage){
        $(".continue-test").hide();
        $(".pause-test").show();
        localStorage.removeItem("TEST_BREAK");
        var nextPage=decodeURIComponent(nextPage);
        document.location.href = nextPage.search("http") < 0 ? "http://" + nextPage : nextPage
    }
}