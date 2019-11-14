import React from 'react';
import { Button, Form, Input, Select, Radio, Notification, DatePicker, Upload, Slider } from 'element-react';

import './index.css';

import request from '../../services/request';
import { iRouter } from '../../ts/react';

interface iProps {
    match: any;
    history: iRouter;
}
interface iDetail {
    id: number;
    channel_title: string;
    title: string;
    channel: string;
    key: string;
    key_type: string;
    val: string;
    json_data: string;
    state: number;
    task_start_time: number;
    task_end_time: number;
    remark: string;
    proption: number;
}
interface iState {
    form: iDetail;
    channel_list: Array<any>;
    start_date: Date | null;
    end_date: Date | null;
}

export default class extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            form: {
                id: 0,
                title: '',
                channel: '',
                channel_title: '',
                key: '',
                key_type: '',
                val: '',
                json_data: '',
                state: 0,
                task_start_time: 0,
                task_end_time: 0,
                remark: '',
                proption: 0
            },
            channel_list: [],
            start_date: null,
            end_date: null
        };
    }

    form: any;

    render() {
        return (
            <div id="config_detail">
                <Form ref={e => (this.form = e)} labelPosition="right">
                    <Form.Item label="频道" labelWidth="100px">
                        <Select size="small" value={this.state.form.channel} placeholder="频道" onChange={e => this.setChannel(e)}>
                            {this.state.channel_list.map(item => (
                                <Select.Option key={item.id + ''} label={item.title} value={item.key}>
                                    <span>
                                        {item.title} &nbsp;
                                        <small>{item.key}</small>
                                    </span>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="标题" labelWidth="100px">
                        <Input
                            size="small"
                            style={{ width: '190px' }}
                            value={this.state.form.title}
                            placeholder="标题说明"
                            onChange={e => this.onChange('title', e)}
                        />
                    </Form.Item>
                    <Form.Item label="key名" labelWidth="100px">
                        <Input
                            size="small"
                            style={{ width: '190px' }}
                            value={this.state.form.key}
                            placeholder="key名"
                            onChange={e => this.onChange('key', e)}
                        />
                        <Select
                            style={{ marginLeft: '10px' }}
                            size="small"
                            value={this.state.form.key_type}
                            placeholder="key类型"
                            onChange={e => this.onChange('key_type', e)}
                        >
                            <Select.Option label="字符串" value="text" />
                            <Select.Option label="数字" value="number" />
                            <Select.Option label="布尔" value="bool" />
                            <Select.Option label="图片" value="image" />
                            <Select.Option label="json" value="json" />
                        </Select>
                        &nbsp;
                        <span className="remark">字母开始的包含字母数字和_的字符串，长度3-18位</span>
                    </Form.Item>
                    <Form.Item label="val" labelWidth="100px">
                        {this.state.form.key_type !== 'json' && this.state.form.key_type !== 'image' && (
                            <Input
                                size="small"
                                style={{ width: '500px' }}
                                value={this.state.form.val}
                                placeholder="val"
                                onChange={e => this.onChange('val', e)}
                            />
                        )}
                        {this.state.form.key_type === 'json' && (
                            <Input
                                size="small"
                                type="textarea"
                                style={{ width: '500px' }}
                                value={this.state.form.json_data}
                                placeholder="val"
                                onChange={e => this.onChange('val', e)}
                            />
                        )}
                        {this.state.form.key_type === 'image' && (
                            <div className="upload_box">
                                <Upload
                                    className="upload_btn"
                                    drag
                                    action="/api_config/imgs/upload"
                                    multiple={false}
                                    withCredentials={true}
                                    showFileList={false}
                                    onSuccess={this.uploaded}
                                    onError={this.uploadErr}
                                    onProgress={this.uploadProgress}
                                    tip={<div className="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>}
                                >
                                    <i className="el-icon-upload"></i>
                                    <div className="el-upload__text">
                                        将文件拖到此处，或<em>点击上传</em>
                                    </div>
                                </Upload>
                                <img className="img_res" src={this.state.form.val} alt="" />
                            </div>
                        )}
                    </Form.Item>
                    <Form.Item label="备注说明" labelWidth="100px">
                        <Input
                            size="small"
                            type="textarea"
                            style={{ width: '500px' }}
                            value={this.state.form.remark}
                            rows={4}
                            placeholder="备注说明"
                            onChange={e => this.onChange('remark', e)}
                        />
                    </Form.Item>
                    <Form.Item label="配置类型" labelWidth="100px">
                        <Radio.Group value={this.state.form.state} onChange={(e: string) => this.setDetailState(e)}>
                            <Radio value="0">普通配置</Radio>
                            <Radio value="1">定时任务</Radio>
                            <Radio value="2">灰度配置</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {this.state.form.state === 1 && (
                        <Form.Item label="定时时间" labelWidth="100px">
                            <DatePicker
                                value={this.state.start_date}
                                placeholder="选择开始日期"
                                isShowTime={true}
                                format="yyyy-MM-dd HH:mm:ss"
                                onChange={date => this.setStartTime(date)}
                            />
                            <DatePicker
                                style={{ marginLeft: '10px' }}
                                value={this.state.end_date}
                                format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择失效日期"
                                isShowTime={true}
                                onChange={date => this.setEndTime(date)}
                            />
                        </Form.Item>
                    )}
                    {this.state.form.state === 2 && (
                        <Form.Item label="灰度比例" labelWidth="100px">
                            <Slider
                                className="slider"
                                onChange={(val: string) => this.onChange('proption', val)}
                                value={this.state.form.proption}
                                step="5"
                                showStops={true}
                            ></Slider>
                            <span>{this.state.form.proption}%</span>
                        </Form.Item>
                    )}
                    <Form.Item label="" labelWidth="100px">
                        <Button onClick={this.add} type="primary">
                            {this.state.form.id > 0 ? '编辑' : '添加'}
                        </Button>
                        <Button onClick={this.goback} type="primary">
                            返回
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    async componentDidMount() {
        try {
            const data = await request.get('/channel/all');
            this.setState({
                channel_list: [{ id: 0, title: '公共', key: '_g' }, ...data]
            });
        } catch (error) {
            console.log(error);
        }
        if (this.props.match.params.id) {
            try {
                const data = await request.get('/configs/' + this.props.match.params.id);

                this.setState({
                    start_date: new Date(data.task_start_time),
                    end_date: new Date(data.task_end_time),
                    form: {
                        id: data.id * 1,
                        title: data.title,
                        channel: data.channel,
                        channel_title: data.channel_title,
                        key: data.key,
                        key_type: data.key_type,
                        val: data.val,
                        json_data: data.json_data,
                        state: data.state,
                        task_start_time: data.task_start_time,
                        task_end_time: data.task_end_time,
                        remark: data.remark,
                        proption: data.proption || 0
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    //==============================
    setChannel(e: string) {
        const one = this.state.channel_list.find(item => item.key === e);
        const form = this.state.form;
        form.channel = one.key;
        form.channel_title = one.title;
        this.setState({
            form
        });
    }

    setDetailState(e: string) {
        const form = this.state.form;
        form.state = parseInt(e);
        this.setState({ form });
    }

    setStartTime(e: Date | null) {
        const form = this.state.form;
        if (e === null) {
            form.task_start_time = 0;
        } else {
            form.task_start_time = e.getTime();
        }
        this.setState({ form, start_date: e });
    }
    setEndTime(e: Date | null) {
        const form = this.state.form;
        if (e === null) {
            form.task_end_time = 0;
        } else {
            form.task_end_time = e.getTime();
        }
        this.setState({ form, end_date: e });
    }
    //==============================
    onChange = (key: string, value: any) => {
        this.setState({
            form: Object.assign({}, this.state.form, { [key]: value })
        });
    };
    onSliderChange = (val: string) => {
        console.log(val);
    };

    handleClose = () => {};

    goback = () => {
        this.props.history.goBack();
    };
    uploadProgress = (event: any) => {
        console.log(event);
    };
    uploaded = (res: any, file: any, list: any) => {
        if (res.status === '0' || res.status === 0) {
            this.onChange('val', res.data);
        } else {
            Notification.error({
                message: res.msg
            });
        }
    };
    uploadErr = (err: any) => {
        Notification.error({
            message: '图片上传失败'
        });
    };
    /**
     * 添加
     */
    add = async () => {
        console.log(this.state.form);
        if (!this.state.form.channel) {
            return Notification.error({
                message: '请选择一个频道'
            });
        }
        if (!this.state.form.title) {
            return Notification.error({
                message: '请填写一个标题'
            });
        }
        if (!/^[a-zA-Z]{1}[a-zA-Z0-9\_]{2,}$/.test(this.state.form.key)) {
            return Notification.error({
                message: 'key的名称不符合规范'
            });
        }
        if (this.state.form.task_start_time > this.state.form.task_end_time) {
            return Notification.error({
                message: '开始时间大于结束时间'
            });
        }
        try {
            await request.post('/configs/add', this.state.form);
            Notification.success({
                message: '编辑完成,发布即可生效'
            });
        } catch (error) {
            Notification.error({
                message: error.message
            });
        }
    };
}
