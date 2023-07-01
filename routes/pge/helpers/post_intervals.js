const querystring = require("querystring");
const axios = require("axios");
const QB = require("../../../config/quickbase");
//  Format Date and Times
const moment = require("moment");
moment().format();

module.exports = {
  post_intervals: async function(time_stamp, intervals, rec_id) {
    const am = {
      _fid_31: "", //12:00 AM
      _fid_40: "", //12:15 AM
      _fid_34: "", //12:30 AM
      _fid_30: "", //12:45 AM

      _fid_25: "", //1:00 AM
      _fid_49: "", //1:15 AM
      _fid_64: "", //1:30 AM
      _fid_47: "", //1:45 AM

      _fid_51: "", //2:00 AM
      _fid_60: "", //2:15 AM
      _fid_36: "", //2:30 AM
      _fid_65: "", //2:45 AM

      _fid_29: "", //3:00 AM
      _fid_61: "", //3:15 AM
      _fid_35: "", //3:30 AM
      _fid_63: "", //3:45 AM

      _fid_32: "", //4:00 AM
      _fid_37: "", //4:15 AM
      _fid_45: "", //4:30 AM
      _fid_62: "", //4:45 AM

      _fid_43: "", //5:00 AM
      _fid_54: "", //5:15 AM
      _fid_46: "", //5:30 AM
      _fid_48: "", //5:45 AM

      _fid_39: "", //6:00 AM
      _fid_69: "", //6:15 AM
      _fid_27: "", //6:30 AM
      _fid_68: "", //6:45 AM

      _fid_33: "", //7:00 AM
      _fid_38: "", //7:15 AM
      _fid_53: "", //7:30 AM
      _fid_28: "", //7:45 AM

      _fid_59: "", //8:00 AM
      _fid_42: "", //8:15 AM
      _fid_26: "", //8:30 AM
      _fid_66: "", //8:45 AM

      _fid_57: "", //9:00 AM
      _fid_58: "", //9:15 AM
      _fid_55: "", //9:30 AM
      _fid_72: "", //9:45 AM

      _fid_71: "", //10:00 AM
      _fid_41: "", //10:15 AM
      _fid_56: "", //10:30 AM
      _fid_67: "", //10:45 AM

      _fid_44: "", //11:00 AM
      _fid_50: "", //11:15 AM
      _fid_52: "", //11:30 AM
      _fid_70: "" //11:45 AM
    };

    const pm = {
      _fid_80: "", //12:00 PM
      _fid_105: "", //12:15 PM
      _fid_76: "", //12:30 PM
      _fid_90: "", //12:45 PM

      _fid_73: "", //1:00 PM
      _fid_75: "", //1:15 PM
      _fid_78: "", //1:30 PM
      _fid_74: "", //1:45 PM

      _fid_89: "", //2:00 PM
      _fid_108: "", //2:15 PM
      _fid_106: "", //2:30 PM
      _fid_87: "", //2:45 PM

      _fid_93: "", //3:00 PM
      _fid_118: "", //3:15 PM
      _fid_92: "", //3:30 PM
      _fid_81: "", //3:45 PM

      _fid_79: "", //4:00 PM
      _fid_91: "", //4:15 PM
      _fid_82: "", //4:30 PM
      _fid_77: "", //4:45 PM

      _fid_86: "", //5:00 PM
      _fid_104: "", //5:15 PM
      _fid_94: "", //5:30 PM
      _fid_100: "", //5:45 PM

      _fid_101: "", //6:00 PM
      _fid_119: "", //6:15 PM
      _fid_115: "", //6:30 PM
      _fid_113: "", //6:45 PM

      _fid_98: "", //7:00 PM
      _fid_110: "", //7:15 PM
      _fid_120: "", //7:30 PM
      _fid_96: "", //7:45 PM

      _fid_83: "", //8:00 PM
      _fid_112: "", //8:15 PM
      _fid_102: "", //8:30 PM
      _fid_84: "", //8:45 PM

      _fid_85: "", //9:00 PM
      _fid_107: "", //9:15 PM
      _fid_95: "", //9:30 PM
      _fid_116: "", //9:45 PM

      _fid_103: "", //10:00 PM
      _fid_99: "", //10:15 PM
      _fid_117: "", //10:30 PM
      _fid_97: "", //10:45 PM

      _fid_111: "", //11:00 PM
      _fid_114: "", //11:15 PM
      _fid_109: "", //11:30 PM
      _fid_88: "" //11:45 PM
    };

    intervals.forEach(reading => {
      let time = moment
        .unix(Number(reading.ns0_timePeriod.ns0_start.value))
        .format("YYYY-MM-DD hh:mm A");
      time = time.split(" ");
      time = `${time[1]} ${time[2]}`;

      // 12AM
      if (time === "12:00 AM") am._fid_31 = reading.ns0_value.value / 1000000;
      if (time === "12:15 AM") am._fid_40 = reading.ns0_value.value / 1000000;
      if (time === "12:30 AM") am._fid_34 = reading.ns0_value.value / 1000000;
      if (time === "12:45 AM") am._fid_30 = reading.ns0_value.value / 1000000;

      // 1AM
      if (time === "01:00 AM") am._fid_25 = reading.ns0_value.value / 1000000;
      if (time === "01:15 AM") am._fid_49 = reading.ns0_value.value / 1000000;
      if (time === "01:30 AM") am._fid_64 = reading.ns0_value.value / 1000000;
      if (time === "01:45 AM") am._fid_47 = reading.ns0_value.value / 1000000;

      // 2AM
      if (time === "02:00 AM") am._fid_51 = reading.ns0_value.value / 1000000;
      if (time === "02:15 AM") am._fid_60 = reading.ns0_value.value / 1000000;
      if (time === "02:30 AM") am._fid_36 = reading.ns0_value.value / 1000000;
      if (time === "02:45 AM") am._fid_65 = reading.ns0_value.value / 1000000;

      // 3AM
      if (time === "03:00 AM") am._fid_29 = reading.ns0_value.value / 1000000;
      if (time === "03:15 AM") am._fid_61 = reading.ns0_value.value / 1000000;
      if (time === "03:30 AM") am._fid_35 = reading.ns0_value.value / 1000000;
      if (time === "03:45 AM") am._fid_63 = reading.ns0_value.value / 1000000;

      // 4AM
      if (time === "04:00 AM") am._fid_32 = reading.ns0_value.value / 1000000;
      if (time === "04:15 AM") am._fid_37 = reading.ns0_value.value / 1000000;
      if (time === "04:30 AM") am._fid_45 = reading.ns0_value.value / 1000000;
      if (time === "04:45 AM") am._fid_62 = reading.ns0_value.value / 1000000;

      // 5AM
      if (time === "05:00 AM") am._fid_43 = reading.ns0_value.value / 1000000;
      if (time === "05:15 AM") am._fid_54 = reading.ns0_value.value / 1000000;
      if (time === "05:30 AM") am._fid_46 = reading.ns0_value.value / 1000000;
      if (time === "05:45 AM") am._fid_48 = reading.ns0_value.value / 1000000;

      // 6AM
      if (time === "06:00 AM") am._fid_39 = reading.ns0_value.value / 1000000;
      if (time === "06:15 AM") am._fid_69 = reading.ns0_value.value / 1000000;
      if (time === "06:30 AM") am._fid_27 = reading.ns0_value.value / 1000000;
      if (time === "06:45 AM") am._fid_68 = reading.ns0_value.value / 1000000;

      // 7AM
      if (time === "07:00 AM") am._fid_33 = reading.ns0_value.value / 1000000;
      if (time === "07:15 AM") am._fid_38 = reading.ns0_value.value / 1000000;
      if (time === "07:30 AM") am._fid_53 = reading.ns0_value.value / 1000000;
      if (time === "07:45 AM") am._fid_28 = reading.ns0_value.value / 1000000;

      // 8AM
      if (time === "08:00 AM") am._fid_59 = reading.ns0_value.value / 1000000;
      if (time === "08:15 AM") am._fid_42 = reading.ns0_value.value / 1000000;
      if (time === "08:30 AM") am._fid_26 = reading.ns0_value.value / 1000000;
      if (time === "08:45 AM") am._fid_66 = reading.ns0_value.value / 1000000;

      // 9AM
      if (time === "09:00 AM") am._fid_57 = reading.ns0_value.value / 1000000;
      if (time === "09:15 AM") am._fid_58 = reading.ns0_value.value / 1000000;
      if (time === "09:30 AM") am._fid_55 = reading.ns0_value.value / 1000000;
      if (time === "09:45 AM") am._fid_72 = reading.ns0_value.value / 1000000;

      // 10AM
      if (time === "10:00 AM") am._fid_71 = reading.ns0_value.value / 1000000;
      if (time === "10:15 AM") am._fid_41 = reading.ns0_value.value / 1000000;
      if (time === "10:30 AM") am._fid_56 = reading.ns0_value.value / 1000000;
      if (time === "10:45 AM") am._fid_67 = reading.ns0_value.value / 1000000;

      // 11AM
      if (time === "11:00 AM") am._fid_44 = reading.ns0_value.value / 1000000;
      if (time === "11:15 AM") am._fid_50 = reading.ns0_value.value / 1000000;
      if (time === "11:30 AM") am._fid_52 = reading.ns0_value.value / 1000000;
      if (time === "11:45 AM") am._fid_70 = reading.ns0_value.value / 1000000;

      // 12PM **************************************************************
      if (time === "12:00 PM") pm._fid_80 = reading.ns0_value.value / 1000000;
      if (time === "12:15 PM") pm._fid_105 = reading.ns0_value.value / 1000000;
      if (time === "12:30 PM") pm._fid_76 = reading.ns0_value.value / 1000000;
      if (time === "12:45 PM") pm._fid_90 = reading.ns0_value.value / 1000000;

      // 1PM
      if (time === "01:00 PM") pm._fid_73 = reading.ns0_value.value / 1000000;
      if (time === "01:15 PM") pm._fid_75 = reading.ns0_value.value / 1000000;
      if (time === "01:30 PM") pm._fid_78 = reading.ns0_value.value / 1000000;
      if (time === "01:45 PM") pm._fid_74 = reading.ns0_value.value / 1000000;

      // 2PM
      if (time === "02:00 PM") pm._fid_89 = reading.ns0_value.value / 1000000;
      if (time === "02:15 PM") pm._fid_108 = reading.ns0_value.value / 1000000;
      if (time === "02:30 PM") pm._fid_106 = reading.ns0_value.value / 1000000;
      if (time === "02:45 PM") pm._fid_87 = reading.ns0_value.value / 1000000;

      // 3PM
      if (time === "03:00 PM") pm._fid_93 = reading.ns0_value.value / 1000000;
      if (time === "03:15 PM") pm._fid_118 = reading.ns0_value.value / 1000000;
      if (time === "03:30 PM") pm._fid_92 = reading.ns0_value.value / 1000000;
      if (time === "03:45 PM") pm._fid_81 = reading.ns0_value.value / 1000000;

      // 4PM
      if (time === "04:00 PM") pm._fid_79 = reading.ns0_value.value / 1000000;
      if (time === "04:15 PM") pm._fid_91 = reading.ns0_value.value / 1000000;
      if (time === "04:30 PM") pm._fid_82 = reading.ns0_value.value / 1000000;
      if (time === "04:45 PM") pm._fid_77 = reading.ns0_value.value / 1000000;

      // 5PM
      if (time === "05:00 PM") pm._fid_86 = reading.ns0_value.value / 1000000;
      if (time === "05:15 PM") pm._fid_104 = reading.ns0_value.value / 1000000;
      if (time === "05:30 PM") pm._fid_94 = reading.ns0_value.value / 1000000;
      if (time === "05:45 PM") pm._fid_100 = reading.ns0_value.value / 1000000;

      // 6PM
      if (time === "06:00 PM") pm._fid_101 = reading.ns0_value.value / 1000000;
      if (time === "06:15 PM") pm._fid_119 = reading.ns0_value.value / 1000000;
      if (time === "06:30 PM") pm._fid_115 = reading.ns0_value.value / 1000000;
      if (time === "06:45 PM") pm._fid_113 = reading.ns0_value.value / 1000000;

      // 7PM
      if (time === "07:00 PM") pm._fid_98 = reading.ns0_value.value / 1000000;
      if (time === "07:15 PM") pm._fid_110 = reading.ns0_value.value / 1000000;
      if (time === "07:30 PM") pm._fid_120 = reading.ns0_value.value / 1000000;
      if (time === "07:45 PM") pm._fid_96 = reading.ns0_value.value / 1000000;

      // 8PM
      if (time === "08:00 PM") pm._fid_83 = reading.ns0_value.value / 1000000;
      if (time === "08:15 PM") pm._fid_112 = reading.ns0_value.value / 1000000;
      if (time === "08:30 PM") pm._fid_102 = reading.ns0_value.value / 1000000;
      if (time === "08:45 PM") pm._fid_84 = reading.ns0_value.value / 1000000;

      // 9PM
      if (time === "09:00 PM") pm._fid_85 = reading.ns0_value.value / 1000000;
      if (time === "09:15 PM") pm._fid_107 = reading.ns0_value.value / 1000000;
      if (time === "09:30 PM") pm._fid_95 = reading.ns0_value.value / 1000000;
      if (time === "09:45 PM") pm._fid_116 = reading.ns0_value.value / 1000000;

      // 10PM
      if (time === "10:00 PM") pm._fid_103 = reading.ns0_value.value / 1000000;
      if (time === "10:15 PM") pm._fid_99 = reading.ns0_value.value / 1000000;
      if (time === "10:30 PM") pm._fid_117 = reading.ns0_value.value / 1000000;
      if (time === "10:45 PM") pm._fid_97 = reading.ns0_value.value / 1000000;

      // 11PM
      if (time === "11:00 PM") pm._fid_111 = reading.ns0_value.value / 1000000;
      if (time === "11:15 PM") pm._fid_114 = reading.ns0_value.value / 1000000;
      if (time === "11:30 PM") pm._fid_109 = reading.ns0_value.value / 1000000;
      if (time === "11:45 PM") pm._fid_88 = reading.ns0_value.value / 1000000;
    });
    const Options = {
      method: "post",
      url: `https://aes.quickbase.com/db/bpjpxv7wt?a=API_AddRecord`,
      data: querystring.stringify({
        _fid_6: rec_id,
        _fid_9: time_stamp,
        ...am,
        ...pm,
        apptoken: QB.QB_API_KEY,
        username: QB.QB_LOGIN,
        password: QB.QB_PASSWORD
      })
    };
    axios(Options).catch(err => console.log(err.request.data));
  }
};
