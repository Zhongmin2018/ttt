import axios from 'axios'

const state = {
    hostip: '',         //通信端ip号
    appid: '',          //控制端通信识别码
    platform: '',       //客户端类型
    userName: '',       //用户名
    authkey: '',        //用户的权限
    currentIndex: 0,    //测试第三步时的索引号
    currentStep: '',    //当前的测试步骤
    firstStep: 0,       //第一步测试的步骤
    deviceType: '',     //设备的型号
    startTime: '',      //机器开始时间
    meanTime: 0,        //机器平均速率
    userStartTime: 0,   //用户开始操作时间
    userNowTime: 0,     //用户当前使用时间
    label: "开始测试",   //开始按钮文字说明
    total: 0,           //用户测试设备的数量
    failNum: 0,         //次品数量
    processTimer: {},
    testStatus: 'testing', //测试标志
    ddns_name: '',      //testproduct测试时的产品ddns.
    nextDdns: '',       //测试5G产品是需要标记下一个mac地址。
    product5G: ['GL-B1300', 'GL-AR750'], //测试产品为5g产品的列表
    userTimer: null,
    thirdData: [{
        'code': '',
        'mac': '',
        'status': '',
        'speed_rx': '0',
        'speed_tx': '0'
    }, {
        'code': '',
        'mac': '',
        'status': '',
        'speed_rx': '0',
        'speed_tx': '0'
    }],                 //  吞吐量测试的初始数据
    thirdstbt: true,    //  吞吐量测试的开始按钮，状态
    processStep: 0,     //  处理的步骤
    Process: []         //  测试流程步骤
}
// 公开到全局的变量
const getters = {
    hostip: state => state.hostip,
    appid: state => state.appid,
    thirdData: state => state.thirdData,
    thirdstbt: state => state.thirdstbt,
    meanTime: state => state.meanTime,
    userName: state => state.userName,
    authkey: state => state.authkey,
    userNowTime: state => state.userNowTime,
    processStep: state => state.processStep,
    platform: state => state.platform,
    label: state => state.label,
    ddns_name: state => state.ddns_name,
    nextDdns: state => state.nextDdns,
    product5G: state => state.product5G,
    testStatus: state => state.testStatus,
}
// 使用dispatch分发的动作体
const actions = {
    // 当运行失败时调用
    async seterr({ state, dispatch }, device) {
        state.failNum += 1;
        switch (state.currentStep) {
            case 'first':
                state.label = "测试失败";
                state.testStatus = 'fail';
                setTimeout(() => {
                    dispatch('setnew');
                }, 5000)
                alert("测试失败");
                break;
            case 'third':
                state.thirdData[state.currentIndex].status = device.status;
                await dispatch('setnew');
                break;
            default:
                state.label = "测试失败";
                state.testStatus = 'fail';
                setTimeout(() => {
                    dispatch('setnew');
                }, 5000)
                alert("测试失败");
                break;
        }
    },
    // 和数据后台交互调用，主要用于上传信息
    async setDataBase({ state, dispatch }, device) {
        axios.put('/api.php', {
            params: device
        }).then((res) => {
            console.log(res);
        })
    },
    // 当执行层执行成功，并返回正确的信息时调用
    async setsuccess({ state, dispatch }, device) {
        state.processStep += 1;
        switch (state.currentStep) {
            case 'first':
                if (state.processStep < state.Process.length) {
                    await dispatch('sendcommand', {
                        'command': state.Process[state.processStep],
                        'payload': device.payload
                    });

                } else {
                    state.label = "测试成功";
                    state.testStatus = 'success';
                    setTimeout(() => {
                        dispatch('setnew');
                    }, 5000)
                }
                break;
            case 'third':
                if (state.processStep < state.Process.length) {
                    state.thirdData[state.currentIndex].status = device.status;
                    await dispatch('sendcommand', {
                        'command': state.Process[state.processStep],
                        'payload': device.payload
                    });
                } else {
                    state.thirdData[state.currentIndex].status = "测试成功";
                    await dispatch('setnew');
                }
                break;
            default:
                if (state.processStep < state.Process.length) {
                    await dispatch('sendcommand', {
                        'command': state.Process[state.processStep],
                        'payload': device.payload
                    });
                } else {
                    state.label = "测试成功";
                    state.testStatus = 'success';
                    const params = {
                        'action': 'updateDeviceInfo',
                        'ddns_name': state.ddns_name,
                        'used': '1',
                    }
                    await dispatch('setDataBase', params);
                    if (state.product5G.indexOf(state.deviceType) != -1) {
                        const params = {
                            'action': 'updateDeviceInfo',
                            'ddns_name': state.nextDdns,
                            'used': '1',
                        }
                        await dispatch('setDataBase', params);
                    }
                    setTimeout(() => {
                        dispatch('setnew');
                    }, 1000)
                }
                break;
        }
    },
    // 恢复初始化设置
    async setnew({ state, dispatch }) {
        let tag = false;
        console.log(state.processStep, state.Process.length);
        if (state.processStep == state.Process.length || state.processStep == 0) {
            tag = true;
        }
        state.processStep = 0;
        const date = new Date();
        if (state.meanTime) {
            state.meanTime = (state.meanTime + (date.getTime() - state.startTime) / 1000) / 2
        } else {
            state.meanTime = (date.getTime() - state.startTime) / 1000;
        }
        state.startTime = date.getTime();
        console.log(state.meanTime)
        console.log(state.currentStep);
        switch (state.currentStep) {
            case 'first':
                state.total += 1;
                state.label = "开始测试";
                state.testStatus = 'testing';
                if (tag) {
                    state.thirdstbt = false;
                    dispatch('sendcommand', {
                        'command': 'onconnect',
                        'payload': {
                            'device_type': state.deviceType,
                            'step': state.currentStep,
                            'index': state.currentIndex
                        }
                    });
                } else {
                    state.thirdstbt = true;
                }
                break;
            case 'second':
                console.log('setSecond');
                state.thirdstbt = true;
                state.total += 1;
                state.testStatus = 'testing';
                state.label = "开始测试";
                break;
            case 'third':
                if (state.thirdData.length - 3 > state.currentIndex) {
                    state.currentIndex += 1;
                    await dispatch('sendcommand', {
                        'command': 'onpower',
                        'payload': {
                            'index': state.currentIndex,
                            'count': state.currentIndex + 2
                        }
                    });
                    await dispatch('sendcommand', {
                        'command': 'onpretreat',
                        'payload': {
                            'index': state.currentIndex,
                            'mac_address': state.thirdData[state.currentIndex].mac
                        }
                    });
                } else {
                    state.currentIndex = 0;
                    state.thirdstbt = false;
                    await dispatch('sendcommand', {
                        'command': 'onconnect',
                        'payload': {
                            'device_type': state.deviceType,
                            'step': state.currentStep,
                            'index': state.currentIndex
                        }
                    });
                }
                break;
            default:
                break;
        }
    },
    // 和执行层交互，发送命令和信息使用
    async sendcommand({ state, dispatch }, device) {
        state.processTimer[device.command] = setTimeout(() => {
            dispatch('seterr');
        }, 55000)
        await state.mqtt.publish('gliot/' + state.hostip + '/' + state.appid + '/' + device.command, JSON.stringify(device.payload));
    },
    // 预设功能，待定
    async onlive({ state, dispatch }, device) { },
    // 初始化设定，对应执行层中的onconnect命令
    async onconnect({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['onconnect'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                state.label = "正在测试中";
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                await dispatch('setsuccess', data);
            }
        } else {
            if (state.currentStep != 'third') {
                state.thirdstbt = true;
                setTimeout(() => {
                    dispatch('setnew');
                }, 1000)
            }
        }
    },
    // 在吞吐量测试中的连接wifi，对应执行层中的onpretreat命令
    async onpretreat({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['onpretreat'])
        if (device.status) {
            data = {
                'status': '设备连接成功',
                'payload': {
                    'index': state.currentIndex
                }
            }
            if (state.Process[state.processStep] == "onpretreat")
                await dispatch('setsuccess', data);
        } else {
            data = {
                'status': '设备连接失败',
            }
            await dispatch('seterr', data);
        }
    },
    // 重置开关动作，对应执行层中的onreset
    async onreset({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['onreset'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "onreset")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // gpio测试动作，对应执行层中的ongpio
    async ongpio({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['ongpio'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "ongpio")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // core版的pcba测试成功
    async oncoreok({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['oncoreok'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "oncoreok")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // mesh开关动作，对应执行层中的onmeshset
    async onmeshset({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['onmeshset'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "onmeshset")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // led灯检测动作，对应执行层中的onled
    async onled({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['onled'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "onled")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 测试sd卡动作，对应执行层中的ontestsd
    async ontestsd({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['ontestsd'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "ontestsd")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 测试内存大小动作，对应执行层中的ontestddr
    async ontestddr({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['ontestddr'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "ontestddr")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 校验检测动作，对应执行层中的oncalibration
    async oncalibration({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['oncalibration'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "oncalibration")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 检测拨动开关动作，对应执行层中的ontestswitch
    async ontestswitch({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['ontestswitch'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "ontestswitch")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 检测拨3Gsim卡槽动作，对应执行层中的ontest3g
    async ontest3g({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['ontest3g'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "ontest3g")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 检测usb动作，对应执行层中的ontestusb
    async ontestusb({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['ontestusb'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "ontestusb")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 检测usb动作，对应执行层中的ontestusb
    async ontestusbmifi({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['ontestusbmifi'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex,
                    }
                }
                if (state.Process[state.processStep] == "ontestusbmifi")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },    

    // 控制5gLED灯，对应执行层中的ongpiofive
    async ongpiofive({ state, dispatch }, device) {
        console.log('ongpiofive', device)
        let data = {};
        clearTimeout(state.processTimer['ongpiofive'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "ongpiofive")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 测试两个拨动开关
    async onswitchleftmid({ state, dispatch }, device) {
        console.log('ontestswitchthree', device)
        let data = {};
        clearTimeout(state.processTimer['onswitchleftmid'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "onswitchleftmid")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 测试三个拨动开关
    async onswitchleftmidright({ state, dispatch }, device) {
        console.log('ontestswitchthree', device)
        let data = {};
        clearTimeout(state.processTimer['onswitchleftmidright'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "onswitchleftmidright")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 下载测试脚本
    async ondowntest({ state, dispatch }, device) {
        console.log('ondowntest', device)
        let data = {};
        clearTimeout(state.processTimer['ondowntest'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "ondowntest")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
       // 测试单片机
       async ontestmcu({ state, dispatch }, device) {
        console.log('ontestmcu', device)
        let data = {};
        clearTimeout(state.processTimer['ontestmcu'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "ontestmcu")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
        // 测试GSP
        async ontestgps({ state, dispatch }, device) {
            console.log('ontestgps', device)
            let data = {};
            clearTimeout(state.processTimer['ontestgps'])
            if (device.status) {
                state.thirdstbt = false;
                if (state.currentStep != 'third') {
                    data = {
                        'payload': {
                            'index': state.currentIndex
                        }
                    }
                    if (state.Process[state.processStep] == "ontestgps")
                        await dispatch('setsuccess', data);
                }
            } else {
                await dispatch('seterr');
            }
        },
        // 测试看门狗
        async ontestdog({ state, dispatch }, device) {
            console.log('ontestdog', device)
            let data = {};
            clearTimeout(state.processTimer['ontestdog'])
            if (device.status) {
                state.thirdstbt = false;
                if (state.currentStep != 'third') {
                    data = {
                        'payload': {
                            'index': state.currentIndex
                        }
                    }
                    if (state.Process[state.processStep] == "ontestdog")
                        await dispatch('setsuccess', data);
                }
            } else {
                await dispatch('seterr');
            }
        },
        // 测试emmc
        async ontestemmc({ state, dispatch }, device) {
        console.log('ontestemmc', device)
        let data = {};
        clearTimeout(state.processTimer['ontestemmc'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "ontestemmc")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
       // 测试蓝牙
       async onbluetooth({ state, dispatch }, device) {
        console.log('onbluetooth', device)
        let data = {};
        clearTimeout(state.processTimer['onbluetooth'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "onbluetooth")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
        // 测试zigbee
        async onzigbee({ state, dispatch }, device) {
        console.log('onzigbee', device)
        let data = {};
        clearTimeout(state.processTimer['onzigbee'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "onzigbee")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 控制电源检测，对应执行层中的onsecondpower
    async onsecondpower({ state, dispatch }, device) {
        console.log('onsecondpower', device)
        let data = {};
        clearTimeout(state.processTimer['onsecondpower'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "onsecondpower")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // pcba测试完成后，最后发送的命令。对应执行层中onfirstok
    async onfirstok({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['onfirstok'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "onfirstok")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // product测试完成之后，最后发送的命令。对应执行层中的onsecondok
    async onsecondok({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['onsecondok'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "onsecondok")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 检测是否进行pcba测试标志。对应执行层中的oncheckfirst
    async oncheckfirst({ state, dispatch }, device) {
        let data = {};
        clearTimeout(state.processTimer['oncheckfirst'])
        if (device.status) {
            state.thirdstbt = false;
            if (state.currentStep != 'third') {
                data = {
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "oncheckfirst")
                    await dispatch('setsuccess', data);
            }
        } else {
            await dispatch('seterr');
        }
    },
    // 进行mac地址比较，对应执行层中的onmacpare
    async onmacpare({ state, dispatch }, device) {
        let data = {};
        let params = {};
        clearTimeout(state.processTimer['onmacpare'])
        if (device.status) {
            if (state.deviceType == 'GL-CORE') {
                params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': state.thirdData[state.currentIndex].ddns_name,
                    'throughput_rx': 'success',
                    'throughput_tx': 'success',
                    'throughpu_test_time': 'setNow'
                }
                await dispatch('setDataBase', params);
                state.thirdData[state.currentIndex].status = '测试成功';
                await dispatch('setnew');
            } else {
                data = {
                    'status': 'mac地址比较成功',
                    'payload': {
                        'index': state.currentIndex
                    }
                }
                if (state.Process[state.processStep] == "onmacpare")
                    await dispatch('setsuccess', data);
            }
        } else {
            if (state.deviceType == 'GL-CORE') {
                params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': state.thirdData[state.currentIndex].ddns_name,
                    'throughput_rx': 'err',
                    'throughput_tx': 'err',
                    'throughpu_test_time': 'setNow'
                }
                await dispatch('setDataBase', params);
            }
            data = {
                'status': 'mac地址比较失败',
            }
            await dispatch('seterr', data);
        }
    },
    // 电源板控制，暂定。对应执行层中的onpower
    async onpower({ state, dispatch }, device) { },
    // 测试吞吐量的rx值。对应执行层中的onspeedrx
    async onspeedrx({ state, dispatch }, device) {
        let data = {};
        let params = {};
        clearTimeout(state.processTimer['onspeedrx'])
        if (device.status) {
            if (state.deviceType.indexOf('5G') != -1) {
                params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': state.thirdData[state.currentIndex].nextDdns,
                    'throughput_rx': device.speed_rx,
                }
            } else {
                params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': state.thirdData[state.currentIndex].ddns_name,
                    'throughput_rx': device.speed_rx,
                }
            }
            await dispatch('setDataBase', params);
            state.thirdData[state.currentIndex].speed_rx = device.speed_rx;
            data = {
                'status': 'speed_rx测试成功',
                'payload': {
                    'index': state.currentIndex
                }
            }
            await dispatch('setsuccess', data);
        } else {
            if (state.deviceType.indexOf('5G') != -1) {
                params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': state.thirdData[state.currentIndex].nextDdns,
                    'throughput_rx': 'err',
                    'throughpu_test_time': 'setNow',
                }
            } else {
                params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': state.thirdData[state.currentIndex].ddns_name,
                    'throughput_rx': 'err',
                    'throughpu_test_time': 'setNow',
                }
            }
            await dispatch('setDataBase', params);
            data = {
                'status': 'speed_rx测试失败',
            }
            await dispatch('seterr', data);
        }
    },
    // 测试吞吐量的tx值，对应执行层中的onspeedtx
    async onspeedtx({ state, dispatch }, device) {
        let data = {};
        let params = {};
        clearTimeout(state.processTimer['onspeedtx'])
        if (device.status) {
            if (state.deviceType.indexOf('5G') != -1) {
                params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': state.thirdData[state.currentIndex].nextDdns,
                    'throughput_rx': device.speed_tx,
                    'throughpu_test_time': 'setNow',
                }
            } else {
                params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': state.thirdData[state.currentIndex].ddns_name,
                    'throughput_tx': device.speed_tx,
                    'throughpu_test_time': 'setNow',
                }
            }
            await dispatch('setDataBase', params);
            state.thirdData[state.currentIndex].speed_tx = device.speed_tx;
            data = {
                'status': 'speed_tx测试成功',
                'payload': {
                    'index': state.currentIndex
                }
            }
            await dispatch('setsuccess', data);
        } else {
            if (state.deviceType.indexOf('5G') != -1) {
                params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': state.thirdData[state.currentIndex].nextDdns,
                    'throughput_tx': 'err',
                    'throughpu_test_time': 'setNow',
                }
            } else {
                params = {
                    'action': 'updateDeviceInfo',
                    'ddns_name': state.thirdData[state.currentIndex].ddns_name,
                    'throughput_tx': 'err',
                    'throughpu_test_time': 'setNow',
                }
            }
            await dispatch('setDataBase', params);
            data = {
                'status': 'speed_tx测试失败',
            }
            await dispatch('seterr', data);
        }
    }
}
const mutations = {
    // 设置全局变量hostip值，即访问设备的ip地址
    sethostip(state, { data }) {
        state.hostip = data.ip;
        // 获取当前版本操作系统
        const plat = navigator.platform.toLowerCase();
        if (plat.indexOf('mac') != -1) {
            state.platform = 'macos';
        }
        if (plat.indexOf('win') != -1) {
            state.platform = 'windows';
        }
        if (plat.indexOf('linux arm') != -1) {
            state.platform = 'raspi';
        }
        console.log(state.platform);
    },
    // 设置访问客户端的特征码。由随机生成。用于和树莓派进行mqtt通信的唯一特征码。
    setappid(state, { data }) {
        state.appid = data.appid;
    },
    // 设置mqtt通信体。
    setmqtt(state, { data }) {
        state.mqtt = data.mqtt;
    },
    // 设置用户登录后的用户名和用户权限值
    setlogin(state, { data }) {
        state.userName = data.userName;
        state.authkey = data.authkey;
        console.log(data);
    },
    // 设置当前步骤
    setstep(state, { data }) {
        state.currentStep = data.step;
        state.processStep = 0;
    },
    // 设置当前测试设备的ddns_name
    setddns(state, { data }) {
        state.ddns_name = data.ddns;
        state.nextDdns = data.nextDdns;
    },
    // 设置当前程序处理的步骤
    setprocess(state, { data }) {
        state.processStep = 0;
        state.Process = data.process;
    },
    // 按钮状态设置
    settirdstbt(state) {
        state.thirdstbt = false;
    },
    // 设置设备的型号
    setDeviceType(stae, { data }) {
        state.deviceType = data.deviceType;
    },
    // 设置测试的开始时间
    setStartTime(state, { data }) {
        state.startTime = data.startTime;
    },
    // 设置用户进入某个页面的开始时间
    setUserStart(state) {
        const tdate = new Date();
        state.userStartTime = tdate.getTime();
        state.userTimer = setInterval(() => {
            const date = new Date();
            state.userNowTime = (date.getTime() - state.userStartTime) / 1000;
        }, 100);
    },
    // 设置用户离开页面的结束时间，并进行行为记录
    setUserStop(state) {
        clearInterval(state.userTimer);
        if (state.currentStep == 'first') {
            if (state.total) {
                axios.post('/api.php', {
                    params: {
                        'action': 'addOperationInfo',
                        'mean_time': state.meanTime.toFixed(2),
                        'user_name': state.userName,
                        'machine_hostip': state.hostip,
                        'total': state.total,
                        'fail_number': state.failNum,
                        'user_time': (state.userNowTime / state.total).toFixed(2),
                        'operate_event': 'pcba',
                    }
                }).then((res) => {
                    state.total = 0;
                    state.failNum = 0;
                    console.log(res);
                })
            }
        } else if (state.currentStep == 'third') {
            if (state.total) {
                axios.post('/api.php', {
                    params: {
                        'action': 'addOperationInfo',
                        'mean_time': state.meanTime.toFixed(2),
                        'user_name': state.userName,
                        'machine_hostip': state.hostip,
                        'total': state.total,
                        'fail_number': state.failNum,
                        'user_time': (state.userNowTime / state.total).toFixed(2),
                        'operate_event': 'throughput',
                    }
                }).then((res) => {
                    state.total = 0;
                    state.failNum = 0;
                    console.log(res);
                })
            }
        } else if (state.currentStep == 'second') {
            if (state.total) {
                axios.post('/api.php', {
                    params: {
                        'action': 'addOperationInfo',
                        'mean_time': state.meanTime.toFixed(2),
                        'user_name': state.userName,
                        'machine_hostip': state.hostip,
                        'total': state.total,
                        'fail_number': state.failNum,
                        'user_time': (state.userNowTime / state.total).toFixed(2),
                        'operate_event': 'testproduct',
                    }
                }).then((res) => {
                    state.total = 0;
                    state.failNum = 0;
                    console.log(res);
                })
            }
        }
    },
    // 设置吞吐量测试的初始化数据
    setTirdData(state, { data }) {
        state.thirdData[data.index].mac = data.mac;
        state.thirdData[data.index].ddns_name = data.ddns_name;
        state.thirdData[data.index].status = data.status;
        console.log(state.thirdData[data.index]);
        const newData = {
            'code': '',
            'mac': '',
            'status': '',
            'speed_rx': '0',
            'speed_tx': '0'
        };
        state.thirdData.push(newData);
        axios.put('/api.php', {
            params: {
                'action': 'updateDeviceInfo',
                'product_type': state.deviceType,
                'ddns_name': data.ddns_name,
                'throughpu_test_name': state.userName
            }
        }).then((res) => {
            console.log(res);
        })
    },
    // 清除吞吐量测试的数据，并进行初始化
    clearTirdData(state) {
        state.total += state.thirdData.length - 2;
        state.currentIndex = 0;
        state.thirdData = [{
            'code': '',
            'mac': '',
            'status': '',
            'speed_rx': '0',
            'speed_tx': '0'
        }, {
            'code': '',
            'mac': '',
            'status': '',
            'speed_rx': '0',
            'speed_tx': '0'
        }];
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}
