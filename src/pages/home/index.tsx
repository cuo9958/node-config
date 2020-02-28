/**
 * 首页
 */
import React from 'react';
import { Button, Form, Input, Select, Layout, Table, Pagination, Notification, Dialog, Tooltip } from 'element-react';
import './index.css';

import request from '../../services/request';
import { iRouter } from '../../ts/react';

interface iProps {
    history: iRouter;
}
interface iState {
    total: number;
    form: any;
    columns: Array<any>;
    list: Array<any>;
    dialogVisible: boolean;
    publishData: any;
    channel_list: Array<any>;
}

function replaceDate(time: string) {
    if (!time) return '';
    return time.replace('T', ' ').replace('.000Z', '');
}

function getDayTime(task_start_time: number, task_end_time: number) {
    const now = Date.now();
    if (now < task_start_time) {
        return <span className="state_wait">待生效</span>;
    }
    if (task_end_time === 0) {
        return <span className="state_long">长期生效</span>;
    }
    if (now < task_end_time) {
        return <span className="state_use">生效中</span>;
    }
    if (now > task_end_time) {
        return <span className="state_none">已过期</span>;
    }
}

export default class extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            total: 1,
            form: {},
            columns: this.columns,
            list: [],
            channel_list: [],
            dialogVisible: false,
            publishData: null
        };
    }
    /**
     * 表格的表头属性
     */
    columns = [
        {
            label: '频道',
            prop: 'channel_title',
            width: 90,
            className: 'list_small'
        },
        {
            label: '标题',
            prop: 'title',
            width: 150,
            className: 'list_small'
        },
        {
            label: 'key',
            prop: 'key',
            width: 120,
            className: 'list_small'
        },
        {
            label: 'value',
            prop: 'val',
            className: 'list_small',
            render: function(row: any) {
                if (row.key_type !== 'image') return row.val;
                return (
                    <div className="table_img_box">
                        <Tooltip content={row.val}>
                            <img alt={row.val} className="table_img" src={row.val} />
                        </Tooltip>
                    </div>
                );
            }
        },
        {
            label: '操作人',
            prop: 'nickname',
            width: 120,
            className: 'list_small',
            render: function(row: any) {
                return (
                    <div className="item_nickname">
                        <span>{row.nickname}</span>
                        <p>{replaceDate(row.createdAt)}</p>
                    </div>
                );
            }
        },
        {
            label: '配置类型',
            prop: 'state',
            width: 100,
            className: 'list_small',
            render: (row: any) => {
                if (row.state === 0) return <span className="used">普通配置</span>;
                if (row.state === 1) return <span className="task">定时任务 </span>;
                if (row.state === 2) return <span className="gray">灰度配置 </span>;
            }
        },
        {
            label: '状态',
            prop: 'status',
            width: 90,
            className: 'list_small',
            render: function(row: any) {
                if (row.status === 0) return <span className="notUse">未使用</span>;
                if (row.status === 1) {
                    if (row.state !== 1) {
                        return <span className="used">生效中</span>;
                    }
                    return getDayTime(row.task_start_time, row.task_end_time);
                }
                if (row.status === 2) {
                    return <span className="willUpdate">有更新</span>;
                }
            }
        },
        {
            label: '操作',
            prop: 'address',
            width: 300,
            className: 'list_small',
            render: (row: any) => {
                return (
                    <div>
                        <Button.Group>
                            <Button onClick={() => this.goDetail(row.id)} plain={true} type="info" size="small">
                                查看
                            </Button>
                            {row.status === 0 && (
                                <Button onClick={() => this.publish(row)} type="info" size="small">
                                    发布
                                </Button>
                            )}
                            {row.status === 1 && (
                                <Button onClick={() => this.pause(row.id)} type="success" size="small">
                                    暂停
                                </Button>
                            )}
                            {row.status === 2 && (
                                <Button onClick={() => this.pause(row.id)} type="success" size="small">
                                    暂停
                                </Button>
                            )}
                            {row.status === 2 && (
                                <Button onClick={() => this.publish(row)} type="info" size="small">
                                    更新
                                </Button>
                            )}
                        </Button.Group>
                        <Button.Group>
                            <Button
                                style={{ marginLeft: '10px' }}
                                type="info"
                                size="small"
                                icon="menu"
                                onClick={() => this.goRecord(row)}
                                plain={true}
                            >
                                历史
                            </Button>
                            <a href={'/api_config/resource/' + row.channel} target="_blank" rel="noopener noreferrer">
                                <Button type="info" size="small" icon="share">
                                    预览
                                </Button>
                            </a>
                        </Button.Group>
                    </div>
                );
            }
        }
    ];

    render() {
        return (
            <div id="config_list">
                <Layout.Row align="middle" className="top_box">
                    <Layout.Col span="24">
                        <Form inline={true} model={this.state.form}>
                            <Form.Item>
                                <Select value={this.state.form.channel} onChange={this.onChange.bind(this, 'channel')} placeholder="频道">
                                    <Select.Option label="所有" value="" />
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
                            <Form.Item>
                                <Input value={this.state.form.key} placeholder="key" onChange={this.onChange.bind(this, 'key')} />
                            </Form.Item>
                            <Form.Item>
                                <Input value={this.state.form.nickname} placeholder="操作人" onChange={this.onChange.bind(this, 'nickname')} />
                            </Form.Item>
                            <Form.Item>
                                <Select value={this.state.form.state} placeholder="类型" onChange={this.onChange.bind(this, 'state')}>
                                    <Select.Option label="所有类型" value="" />
                                    <Select.Option label="普通" value="0" />
                                    <Select.Option label="定时任务" value="1" />
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Select value={this.state.form.status} placeholder="状态" onChange={this.onChange.bind(this, 'status')}>
                                    <Select.Option label="全部" value="" />
                                    <Select.Option label="未使用" value="0" />
                                    <Select.Option label="生效中" value="1" />
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button onClick={() => this.searchData()} type="primary">
                                    查询
                                </Button>
                            </Form.Item>
                        </Form>
                    </Layout.Col>
                </Layout.Row>
                <div className="bundle_box">
                    <Table
                        style={{ width: '100%' }}
                        rowClassName={this.rowClassName.bind(this)}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                    />
                </div>
                <div className="bundle_footer">
                    <Pagination layout="prev, pager, next, total" total={this.state.total} pageSize={20} onCurrentChange={this.onCurrentChange} />
                </div>
                <Dialog title="提示" size="tiny" visible={this.state.dialogVisible} onCancel={() => this.setState({ dialogVisible: false })}>
                    <Dialog.Body>
                        <span>确定要发布这次更新到线上？</span>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button onClick={() => this.setState({ dialogVisible: false })}>取消</Button>
                        <Button type="primary" onClick={() => this.publishSure()}>
                            确定
                        </Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }

    async componentDidMount() {
        this.getChannel();
        this.getList(1);
    }
    async getChannel() {
        try {
            const list = await request.get('/channel/all');
            this.setState({
                channel_list: [{ id: 0, title: '公共', key: '_g' }, ...list]
            });
        } catch (error) {}
    }
    pageindex = 1;
    async getList(pageindex: number) {
        try {
            this.pageindex = pageindex;
            let data = await request.get('/configs', Object.assign({ limit: pageindex }, this.state.form));
            this.setState({
                total: data.count,
                list: data.rows
            });
        } catch (error) {
            console.log(error);
            Notification.error({
                message: error.message
            });
        }
    }
    async searchData() {
        this.getList(1);
    }
    onChange = (key: string, value: any) => {
        this.setState({
            form: Object.assign({}, this.state.form, { [key]: value })
        });
    };
    /**
     * 根据状态选择
     * @param row
     * @param index
     */
    rowClassName(row: any, index: number) {
        if (index === 1) return 'info-row';
        if (index === 3) {
            return 'positive-row';
        }
        return '';
    }
    /**
     * 点击跳转页面
     */
    onCurrentChange = (currentPage: number) => {
        this.getList(currentPage);
    };
    goRecord(row: any) {
        this.props.history.push('/record/' + row.id);
    }
    goDetail(id: number) {
        this.props.history.push('/edit/' + id);
    }
    async delBundle(id: number) {
        try {
            await request.post('/bundle/del/' + id);
            this.getList(this.pageindex);
        } catch (error) {
            console.log(error);
            Notification.error({
                message: error.message
            });
        }
    }
    async pause(id: number) {
        try {
            await request.post('/configs/pause/' + id);
            this.getList(this.pageindex);
        } catch (error) {
            console.log(error);
            Notification.error({
                message: error.message
            });
        }
    }
    async publish(data: any) {
        this.setState({ dialogVisible: true, publishData: data });
    }
    async publishSure() {
        this.setState({ dialogVisible: false });
        if (!this.state.publishData || !this.state.publishData.id) return;
        try {
            await request.post('/configs/publish/' + this.state.publishData.id);
            this.getList(this.pageindex);
            this.setState({ publishData: null });
        } catch (error) {
            console.log(error);
            Notification.error({
                message: error.message
            });
        }
    }
}
