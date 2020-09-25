import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import './index.less';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Slider from '@material-ui/core/Slider';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import XHRUpload from '@uppy/xhr-upload';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { inject } from 'mobx-react';

import Utils from '../../service/Utils';
import { get, post } from '../../service/Request';

const opts: any = {
    meta: { type: 'avatar' },
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true,
};

interface IModel {
    [key: string]: string | number;
    channel: string;
    title: string;
    key: string;
    key_type: 'text' | 'number' | 'bool' | 'image' | 'json';
    json_data: string;
    val: string;
    state: number;
    remark: string;
    proption: number;
    task_start_time: number;
    task_end_time: number;
}
interface IState {
    model: IModel;
    channel_list: any[];
    showUpload: boolean;
    message: string;
    open: boolean;
}
interface IParams {
    id?: number;
}
interface IProps extends IRoute {
    token: string;
    nickname: string;
    username: string;
}
@inject((models: any) => ({
    token: models.user.token,
    nickname: models.user.nickname,
    username: models.user.username,
}))
export default class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            channel_list: [],
            showUpload: false,
            message: '',
            open: false,
            model: {
                channel: '',
                title: '',
                key: '',
                key_type: 'text',
                json_data: '',
                val: '',
                state: 0,
                remark: '',
                proption: 0,
                task_start_time: 0,
                task_end_time: 0,
            },
        };
        this.params = (Utils.parseParams(props.location.search).query || {}) as IParams;
        const uppy: any = Uppy(opts);

        uppy.use(XHRUpload, {
            endpoint: '/api_config/imgs/upload',
            fieldName: 'file',
            headers: {
                token: props.token,
                nickname: encodeURIComponent(props.nickname),
                username: props.username,
            },
        });

        uppy.on('complete', this.uploaded);
        this.uppy = uppy;
    }
    params: IParams = {};
    uppy?: any;
    render() {
        return (
            <div id="detail">
                <div className="item">
                    <FormControl className="sel" variant="outlined">
                        <InputLabel id="label-status">频道</InputLabel>
                        <Select labelId="label-status" value={this.state.model.channel} onChange={(e: any) => this.onChange(e.target.value, 'channel')} className="channel">
                            {this.state.channel_list.map((item, index) => (
                                <MenuItem value={item.key} key={index}>
                                    <span className="project-item">
                                        {item.title}&nbsp;{item.key}
                                    </span>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="item">
                    <TextField label="标题" value={this.state.model.title} onChange={(e: any) => this.onChange(e.target.value, 'title')} variant="outlined" />
                </div>
                <div className="item">
                    <TextField label="key" className="first" value={this.state.model.key} onChange={(e: any) => this.onChange(e.target.value, 'key')} variant="outlined" />
                    <FormControl className="sel first" variant="outlined">
                        <InputLabel id="label-status">值类型</InputLabel>
                        <Select labelId="label-status" value={this.state.model.key_type} onChange={(e: any) => this.onChange(e.target.value, 'key_type')} className="channel">
                            <MenuItem value={'text'}>
                                <span className="select-item">字符串</span>
                            </MenuItem>
                            <MenuItem value={'number'}>
                                <span className="select-item">数字</span>
                            </MenuItem>
                            <MenuItem value={'bool'}>
                                <span className="select-item">布尔</span>
                            </MenuItem>
                            <MenuItem value={'image'}>
                                <span className="select-item">图片</span>
                            </MenuItem>
                            <MenuItem value={'json'}>
                                <span className="select-item">Json</span>
                            </MenuItem>
                        </Select>
                    </FormControl>
                    {this.state.model.key_type === 'text' && (
                        <TextField label="配置内容" value={this.state.model.val} onChange={(e: any) => this.onChange(e.target.value, 'val')} variant="outlined" />
                    )}
                    {this.state.model.key_type === 'number' && (
                        <TextField label="配置内容" value={this.state.model.val} onChange={(e: any) => this.onChange(e.target.value, 'val')} variant="outlined" />
                    )}
                    {this.state.model.key_type === 'bool' && (
                        <TextField label="配置内容" value={this.state.model.val} onChange={(e: any) => this.onChange(e.target.value, 'val')} variant="outlined" />
                    )}
                </div>
                <div className="item">
                    {this.state.model.key_type === 'json' && (
                        <TextField
                            label="请输入json字符串"
                            rows={4}
                            multiline
                            className="area"
                            value={this.state.model.json_data}
                            onChange={(e: any) => this.onChange(e.target.value, 'json_data')}
                            variant="outlined"
                        />
                    )}
                </div>
                {this.state.model.key_type === 'image' && (
                    <div className="item">
                        <img className="upload-img" src={this.state.model.val} alt="" />
                        <div>
                            <Button size="small" className="btn-search" variant="contained" color="primary" onClick={() => this.setState({ showUpload: true })}>
                                {this.state.model.val.length > 10 ? '重新上传' : '上传图片'}
                            </Button>
                        </div>
                        <DashboardModal
                            closeModalOnClickOutside
                            onRequestClose={() => this.setState({ showUpload: false })}
                            open={this.state.showUpload}
                            uppy={this.uppy}
                            height="330px"
                            thumbnailWidth={30}
                            width="90%"
                            closeAfterFinish
                            locale={{ strings: { dropPasteFiles: '拖动文件或者 %{browse}浏览' } }}
                        />
                    </div>
                )}
                <div className="item">
                    <TextField
                        label="备注"
                        className="area"
                        rows={4}
                        multiline
                        value={this.state.model.remark}
                        onChange={(e: any) => this.onChange(e.target.value, 'remark')}
                        variant="outlined"
                    />
                </div>
                <div className="item">
                    <FormControl component="fieldset">
                        <FormLabel component="legend">配置类型</FormLabel>
                        <RadioGroup
                            className="state"
                            aria-label="gender"
                            name="state"
                            value={this.state.model.state}
                            onChange={(e: any) => this.onChange(e.target.value * 1, 'state')}
                        >
                            <FormControlLabel value={0} control={<Radio color="primary" />} label="普通配置" />
                            <FormControlLabel value={1} control={<Radio color="primary" />} label="定时配置" />
                            <FormControlLabel value={2} control={<Radio color="primary" />} label="灰度配置" />
                        </RadioGroup>
                    </FormControl>
                </div>
                {this.state.model.state === 2 && (
                    <div className="item">
                        <Slider
                            defaultValue={0}
                            onChange={(e: any, value) => this.onChange(value as number, 'proption')}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            value={this.state.model.proption}
                            step={5}
                            marks
                            min={0}
                            max={100}
                        />
                    </div>
                )}
                {this.state.model.state === 1 && (
                    <div className="item">
                        <TextField
                            label="开始时间"
                            type="datetime-local"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className="first"
                            value={Utils.DateFormartNumber(this.state.model.task_start_time, 'yyyy-MM-ddThh:mm')}
                            onChange={(e) => this.onChange(new Date(e.target.value).getTime(), 'task_start_time')}
                        />
                        <TextField
                            label="结束时间"
                            type="datetime-local"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={Utils.DateFormartNumber(this.state.model.task_end_time, 'yyyy-MM-ddThh:mm')}
                            onChange={(e) => this.onChange(new Date(e.target.value).getTime(), 'task_end_time')}
                        />
                    </div>
                )}
                <div className="item">
                    <Button className="btn-search" variant="contained" color="primary" onClick={() => this.onSave()}>
                        保存
                    </Button>
                </div>
                <Snackbar open={this.state.open} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} message={this.state.message} onClose={this.onMessageClose} />
            </div>
        );
    }
    componentDidMount() {
        this.getAllChannel();
        this.getDetail();
    }
    async getDetail() {
        try {
            const data: IModel = await get('/configs/' + this.params.id);
            this.setState({
                model: {
                    channel: data.channel,
                    title: data.title,
                    key: data.key,
                    key_type: data.key_type,
                    json_data: data.json_data,
                    val: data.val,
                    state: data.state,
                    remark: data.remark,
                    proption: data.proption,
                    task_start_time: data.task_start_time,
                    task_end_time: data.task_end_time,
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
    uploaded = (result: any) => {
        const data = result.successful[0].response.body;
        if (data.status === 0) {
            this.onChange(data.data, 'val');
        } else {
            this.showMessage(data.msg);
        }
    };
    /**
     * 获取所有的频道列表
     */
    async getAllChannel() {
        try {
            const channel_list = await get('/channel/all');
            this.setState({ channel_list });
        } catch (error) {
            console.log(error);
        }
    }
    onChange = (value: string | number, keyName: string) => {
        let data = this.state.model;
        data[keyName] = value;
        this.setState({ model: data });
    };

    async onSave() {
        try {
            const data = Object.assign({}, this.state.model, { id: 0 });
            if (this.params.id) {
                data.id = this.params.id * 1;
            }
            await post('/configs/add', data);
            this.showMessage('保存成功');
        } catch (error) {
            console.log(error);
            this.showMessage(error.message);
        }
    }
    /**
     * 展示消息
     * @param msg 消息内容
     */
    showMessage(msg: string) {
        this.setState({
            message: msg,
            open: true,
        });
    }
    /**
     * 关闭消息
     */
    onMessageClose = () => {
        this.setState({
            message: '',
            open: false,
        });
    };
}
