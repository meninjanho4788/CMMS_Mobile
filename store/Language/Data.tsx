import { Action, Reducer } from 'redux';
import { AppThunkAction } from "..";

export interface LangState {
  MyLang: LanguageM;
}

export interface SetLang {
  type: 'SET_LANG_DATA',
  MyLang: LanguageM,
}

type KnownAction = SetLang;

export const actionCreators = {
  setLang: (_MyLang: LanguageM): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({ type: 'SET_LANG_DATA', MyLang:_MyLang });
  }
};

const unloadedState: LangState = {MyLang:
{
  homescreen: {
    menu: {
      appname: "CMMS",
      version: "Phiên bản :",
      makeby: "Được phát triển bởi Thuận Nhật",
      newrepairrequest: "New Repair Request",
      listrepairrequest: "Request prder",
      calendar: "Calendar",
      mymaintenance: "Maintenance work order",
      equipmenthistory: "Equipment tracking",
      settings: "Settings",
      done: "Done",
      avatar: "Change avatar image",
      signout: "Sign out",
      removeotp: "Remove OTP",
      inputpassword: "Input password",
      remove: "Remove"
    },
    logout: {
      title: "Log Out User",
      question: "Do you want to Logout?",
      cancel: "Cancel",
      logout: "LogOut"
    }
  },
  newrequestscreen: {
    main: {
      title: "New Repair Request",
      qrcode: "QR Code",
      equipmentcode: "Equipment Code",
      equipmentname: "Equipment Name",
      equipmentlocation: "Equipment Location",
      priority: "Priority",
      description: "Description",
      picture: "Picture",
      stopdevice: "Stop Device",
      btnsave: "SAVE"
    }
  },
  repairrequestscreen: {
    main: {
      title1: "Repair Request List",
      search1: "Search repair request",
      title2: "Chi tiết phiếu yêu cầu sửa chữa",
      equipmentcode: "Equipment Code",
      equipmentname: "Equipment Name",
      equipmentlocation: "Equipment Location",
      priority: "Priority",
      description: "Description",
      rootcase: "Root Case",
      solution: "Solution",
      before: "Before",
      after: "After",
      remark: "Remark",
      status: "Status",
      assignee: "Assignee",
      assigneechoose: "Choose Assignee",
      assigneefilter: "Input key filter",
      btnsave: "SAVE",
      postingdate: "Posting Date :"
    }
  },
  calendarscreen: {
    main: {
      title: "Calendar",
      listequipment: "List Equipment"
    }
  },
  maintenancescreen: {
    main: {
      title1: "Maintenance Request List",
      priority: "Priority",
      duedate: "Due Date",
      status: "Status",
      listequipment: "List Equipment",
      listofwork: "List of works:",
      picture: "Picture :",
      description: "Description :",
      status2: "Status",
      btnsave: "SAVE"
    }
  },
  equipmenthistoryscreen: {
    main: {
      title1: "Equipment History",
      qrcode:"QR Code :",
      title2: "'s History",
      equipmentcode: "Equipment Code :",
      equipmentname: "Equipment Name :",
      equipmentlocation: "Equipment Location :",
      power: "Power :",
      picture:"Picture :",
      mainequipment: "Main Equipment :",
      isactive: "Is Active :",
      spec: "Specification :",
      note: "Note :",
      failtrack: "Failure tracking",
      maintrack: "Maintenance tracking",
      replace: "Replacement of items"
    }
  },
  settingsscreen: {
    main: {
      title: "New Repair Request",
      language: "Language",
      version: "Calendar",
      removeOTP: "remove OTP",
      logout: "Logout user",
      username: "Tên đăng nhập",
      password: "Mật khẩu",
      login: "ĐĂNG NHẬP",
      ghinho: "Ghi nhớ mật khẩu",
      titledeleteimage:"Delete image.",
      questiondeleteimage:"Are you sure delete current image ?",
      cancel: "Cancel",
      delete: "Delete"
    },
    outotp: {
      title: "Xoá OTP",
      question: "Bạn có chắc là muốn xoá OTP ?",
      cancel: "Không",
      logout: "Có"
    }
  },
  combostring: {
    status: {
      open: "Open",
      onhold: "On Hold",
      inprogress: "In Progress",
      complete: "Complete"
    },
    priority:{
      low: "Low",
      medium: "Medium",
      high: "Urgency"
    },
    danhgia:{
      good: "Good",
      notgood: "Not Good"
    }
  },
  errormessage:{
    thietbi: " Equipment ",
    chuachon: "Not yet choose ",
    cantsave: ", cant Save !",
    notempty: " cant be empty",
    insertsuccess: " Insert Successful ",
    insertfail: " Insert Fail ",
    kotimthay: " Cant Found ",
    nomaintenaceequipment: "No Have Maintenance Equipment",
    listempty: "The list is empty !",
    permissionchooseassignee: "You no have permission choose Assignee !",
    notyetchoosekeyperson: "Not yet choose key person",
    isrequired: " is required !",
    noplan:"This Equipment no have Plan Maintenance.",
    cantfindequip: "Can't find this equipment QR code in WO"
  },
  color:{
    low: "#848484",
    medium: "#E18512",
    urgency: "#FF0000"
  }
}
};

export const reducer: Reducer<LangState> = (state: LangState | undefined, incomingAction: Action): LangState => {
  if (state === undefined) {
    return unloadedState;
  }
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case 'SET_LANG_DATA':
      return {
        MyLang: action.MyLang,
      };
    default:
      const exhaustiveCheck = action;
  }
  return state || unloadedState;
};
interface LanguageM {
  homescreen: {
    menu:{
      appname: string;
      version: string;
      makeby: string;
      newrepairrequest: string;
      listrepairrequest: string;
      calendar: string;
      mymaintenance: string;
      equipmenthistory: string;
      settings: string;
      done: string;
      avatar: string;
      signout: string;
      removeotp: string;
      inputpassword: string;
      remove: string;
    },
    logout: {
      title: string;
      question: string;
      cancel: string;
      logout: string;
    }
  },
  newrequestscreen: {
    main: {
      title: string;
      qrcode: string;
      equipmentcode: string;
      equipmentname: string;
      equipmentlocation: string;
      priority: string;
      description: string;
      picture: string;
      stopdevice: string;
      btnsave: string;
    }
  },
  repairrequestscreen: {
    main: {
      title1: string;
      search1: string;
      title2: string;
      equipmentcode: string;
      equipmentname: string;
      equipmentlocation: string;
      priority: string;
      description: string;
      rootcase: string;
      solution: string;
      before: string;
      after: string;
      remark: string;
      status: string;
      assignee: string;
      assigneechoose: string;
      assigneefilter: string;
      btnsave: string;
      postingdate: string;
    }
  },
  calendarscreen: {
    main: {
      title: string;
      listequipment: string;
    }
  },
  maintenancescreen: {
    main: {
      title1: string;
      priority: string;
      duedate: string;
      status: string;
      listequipment: string;
      listofwork: string;
      picture: string;
      description: string;
      status2: string;
      btnsave: string;
    }
  },
  equipmenthistoryscreen: {
    main: {
      title1: string;
      qrcode: string;
      title2: string;
      equipmentcode: string;
      equipmentname: string;
      equipmentlocation: string;
      power: string;
      picture: string;
      mainequipment: string;
      isactive: string;
      spec: string;
      note: string;
      failtrack: string;
      maintrack: string;
      replace: string;
    }
  },
  settingsscreen: {
    main: {
      title: string;
      language: string;
      version: string;
      removeOTP: string;
      logout: string;
      username: string;
      password: string;
      login: string;
      ghinho: string;
      titledeleteimage: string;
      questiondeleteimage: string;
      cancel: string;
      delete: string;
    },
    outotp: {
      title: string;
      question: string;
      cancel: string;
      logout: string;
    }
  },
  combostring: {
    status: {
      open: string;
      onhold: string;
      inprogress: string;
      complete: string;
    },
    priority:{
      low: string;
      medium: string;
      high: string;
    },
    danhgia:{
      good: string;
      notgood: string;
    }
  },
  errormessage:{
    thietbi: string;
    chuachon: string;
    cantsave: string;
    notempty: string;
    insertsuccess: string;
    insertfail: string;
    kotimthay: string;
    nomaintenaceequipment: string;
    listempty: string;
    permissionchooseassignee: string;
    notyetchoosekeyperson: string;
    isrequired: string;
    noplan: string;
    cantfindequip: string;
  },
  color:{
    low: string;
    medium: string;
    urgency: string;
  }
}
