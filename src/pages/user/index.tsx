import React from 'react';
import {
    Button,
    Form,
    Input,
    Layout,
    Table,
    Checkbox,
    Pagination,
    Notification
} from 'element-react';
import './index.css';
import request from '../../services/request';

interface iProps {}
interface iState {
    form: {
        username: string;
        qlist: string;
        id: number;
        pwd: string;
    };
    columns: Array<any>;
    list: Array<any>;
    count: number;
    check_list: Array<string>;
}

const qlist_emus = [
    '添加配置',
    '发布暂停配置',
    '频道管理',
    '用户管理',
    '历史记录管理'
];

export default class extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            form: {
                id: 0,
                username: '',
                qlist: '',
                pwd: ''
            },
            count: 0,
            columns: this.columns,
            list: [],
            check_list: []
        };
    }

    /**
     * 表格的表头属性
     */
    columns = [
        {
            label: '用户名',
            prop: 'username',
            width: 120,
            className: 'list_small'
        },
        {
            label: '权限',
            prop: 'qlist',
            className: 'list_small',
            render: function(row: any) {
                const list: string[] = [];
                row.qlist.split(',').forEach((item: string) => {
                    if (item && item !== undefined) {
                        list.push(qlist_emus[parseInt(item)]);
                    }
                });
                return list.join(',');
            }
        },
        {
            label: '最后一次登录日期',
            prop: 'updatedAt',
            width: 200,
            className: 'list_small'
        },
        {
            label: '创建人',
            prop: 'nickname',
            width: 80,
            className: 'list_small'
        },
        {
            label: '状态',
            prop: 'status',
            width: 70,
            className: 'list_small',
            render: function(row: any) {
                if (row.status === 1) return '启用';
                if (row.status === 0) return '禁止';
                return '';
            }
        },
        {
            label: '操作',
            width: 170,
            render: (row: any) => {
                return (
                    <Button.Group>
                        <Button
                            onClick={() => this.changeStatus(row.id, 1)}
                            type="info"
                            size="small"
                        >
                            启用
                        </Button>
                        <Button
                            onClick={() => this.changeStatus(row.id, 0)}
                            type="warning"
                            size="small"
                        >
                            禁止
                        </Button>
                        <Button
                            onClick={() => this.modify(row)}
                            type="success"
                            size="small"
                        >
                            修改
                        </Button>
                    </Button.Group>
                );
            }
        }
    ];

    render() {
        return (
            <div id="user_list">
                <Layout.Row align="middle" className="top_box">
                    <Layout.Col span="24">
                        <Form inline={true} model={this.state.form}>
                            <Form.Item>
                                <Input
                                    value={this.state.form.username}
                                    placeholder="用户名"
                                    onChange={(e: any) => this.setUsername(e)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    value={this.state.form.pwd}
                                    placeholder="密码"
                                    onChange={(e: any) => this.setPwd(e)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Checkbox.Group
                                    value={this.state.check_list}
                                    onChange={(e: any) => this.setQlist(e)}
                                >
                                    {qlist_emus.map((item, index) => (
                                        <Checkbox label={item} key={index} />
                                    ))}
                                </Checkbox.Group>
                            </Form.Item>
                            <Form.Item>
                                {this.state.form.id > 0 && (
                                    <Button.Group>
                                        <Button
                                            onClick={() => this.modifyChannel()}
                                            type="primary"
                                        >
                                            修改
                                        </Button>
                                        <Button
                                            onClick={() => this.cancel()}
                                            type="info"
                                        >
                                            取消
                                        </Button>
                                    </Button.Group>
                                )}
                                {this.state.form.id === 0 && (
                                    <Button
                                        onClick={() => this.addChannel()}
                                        type="primary"
                                    >
                                        添加
                                    </Button>
                                )}
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
                    <Pagination
                        layout="prev, pager, next, total"
                        total={this.state.count}
                        pageSize={20}
                        onCurrentChange={this.onCurrentChange}
                    />
                </div>
            </div>
        );
    }
    componentDidMount() {
        this.loadData(1);
    }
    pageIndex = 1;
    async loadData(pageIndex: number) {
        try {
            this.pageIndex = pageIndex;
            let data = await request.get('/user/all', { limit: pageIndex });
            this.setState({
                count: data.count,
                list: data.rows
            });
        } catch (error) {
            console.log(error);
        }
    }
    //=====================================
    setUsername(e: string) {
        const form = this.state.form;
        form.username = e;
        this.setState({ form });
    }
    setPwd(e: string) {
        const form = this.state.form;
        form.pwd = e;
        this.setState({ form });
    }
    setQlist(e: string[]) {
        const list: number[] = [];
        e.forEach(item => {
            const index = qlist_emus.findIndex(test => item === test);
            list.push(index);
        });
        const form = this.state.form;
        form.qlist = list.join(',');
        this.setState({ form });
    }
    //=====================================
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
        if (row.status === 0) return 'not_use';
        if (row.status === 1) return 'used';
        return '';
    }
    /**
     * 点击跳转页面
     */
    onCurrentChange = (currentPage: number) => {
        this.loadData(currentPage);
    };
    async addChannel() {
        try {
            await request.post('/user/add', this.state.form);
            this.setState({
                form: {
                    id: 0,
                    username: '',
                    qlist: '',
                    pwd: ''
                },
                check_list: []
            });
            this.loadData(this.pageIndex);
            Notification.success({
                message: '添加成功'
            });
        } catch (error) {
            Notification.error({
                message: error.message
            });
        }
    }
    async modifyChannel() {
        try {
            await request.post('/user/add', this.state.form);
            this.setState({
                form: {
                    id: 0,
                    username: '',
                    qlist: '',
                    pwd: ''
                },
                check_list: []
            });
            this.loadData(this.pageIndex);
            Notification.success({
                message: '修改成功'
            });
        } catch (error) {
            Notification.error({
                message: error.message
            });
        }
    }
    async changeStatus(id: number, status: number) {
        try {
            await request.post('/user/change/' + id, { status });
            this.loadData(this.pageIndex);
        } catch (error) {
            //
        }
    }

    modify(data: any) {
        const list: string[] = [];
        data.qlist.split(',').forEach((item: string) => {
            if (item && item !== 'underfind')
                list.push(qlist_emus[parseInt(item)]);
        });
        this.setState({
            form: {
                id: data.id,
                username: data.username,
                qlist: data.qlist,
                pwd: data.pwd
            },
            check_list: list
        });
    }

    cancel() {
        this.setState({
            form: {
                id: 0,
                username: '',
                qlist: '',
                pwd: ''
            },
            check_list: []
        });
    }
}
