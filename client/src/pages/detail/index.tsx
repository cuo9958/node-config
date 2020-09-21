import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
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

import Utils from '../../service/Utils';
import { get, post } from '../../service/Request';

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
}
interface IState {
    model: IModel;
    channel_list: any[];
}
interface IParams {
    id?: number;
}
export default class extends React.Component<IRoute, IState> {
    constructor(props: IRoute) {
        super(props);
        this.state = {
            channel_list: [],
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
            },
        };
        this.params = (Utils.parseParams(props.location.search).query || {}) as IParams;
    }
    params: IParams = {};
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
                <div className="item">
                    <Button className="btn-search" variant="contained" color="primary" onClick={() => this.onSave()}>
                        保存
                    </Button>
                </div>
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
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
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
    //id: 165
    // title: test2
    // channel: test
    // channel_title: 测试相关
    // key: test2
    // key_type: json
    // val:
    // json_data: {a:1}
    // state: 0
    // task_start_time: 0
    // task_end_time: 0
    // remark:
    // proption: 0
    async onSave() {
        try {
            const data = Object.assign({}, this.state.model, { id: 0 });
            if (this.params.id) {
                data.id = this.params.id * 1;
            }
            console.log(data);
            // await post('/add', data);
        } catch (error) {
            console.log(error);
        }
    }
}
