import React from "react";
import {
    Button,
    Form,
    Input,
    Layout,
    Table,
    Pagination,
    Notification
} from "element-react";
import "./index.css";
import request from "../../services/request";

interface iProps {}
interface iState {
    form: {
        title: string;
        key: string;
        remark: string;
        id: number;
    };
    columns: Array<any>;
    list: Array<any>;
    count: number;
}

export default class extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            form: {
                id: 0,
                title: "",
                key: "",
                remark: ""
            },
            count: 0,
            columns: this.columns,
            list: []
        };
    }

    /**
     * 表格的表头属性
     */
    columns = [
        {
            label: "频道名称",
            prop: "title",
            width: 120,
            className: "list_small"
        },
        {
            label: "频道key",
            prop: "key",
            width: 120,
            className: "list_small"
        },
        {
            label: "备注",
            prop: "remark",
            className: "list_small"
        },
        {
            label: "创建日期",
            prop: "createdAt",
            width: 200,
            className: "list_small"
        },
        {
            label: "创建人",
            prop: "nickname",
            width: 100,
            className: "list_small"
        },
        {
            label: "状态",
            prop: "status",
            width: 70,
            className: "list_small",
            render: function(row: any) {
                if (row.status === 1) return "启用";
                if (row.status === 0) return "禁止";
                return "";
            }
        },
        {
            label: "操作",
            width: 200,
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
            <div id="label_list">
                <Layout.Row align="middle" className="top_box">
                    <Layout.Col span="24">
                        <Form inline={true} model={this.state.form}>
                            <Form.Item>
                                <Input
                                    value={this.state.form.title}
                                    placeholder="标题"
                                    onChange={(e: any) => this.setTitle(e)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    value={this.state.form.key}
                                    disabled={this.state.form.id > 0}
                                    placeholder="频道key"
                                    onChange={(e: any) => this.setKey(e)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    value={this.state.form.remark}
                                    placeholder="备注说明"
                                    style={{ width: "400px" }}
                                    type="textarea"
                                    onChange={(e: any) => this.setRemark(e)}
                                />
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
                        style={{ width: "100%" }}
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
            let data = await request.get("/channel", { limit: pageIndex });
            this.setState({
                count: data.count,
                list: data.rows
            });
        } catch (error) {
            console.log(error);
        }
    }
    //=====================================
    setTitle(e: string) {
        const form = this.state.form;
        form.title = e;
        this.setState({ form });
    }
    setKey(e: string) {
        const form = this.state.form;
        form.key = e;
        this.setState({ form });
    }
    setRemark(e: string) {
        const form = this.state.form;
        form.remark = e;
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
        if (row.status === 0) return "not_use";
        if (row.status === 1) return "used";
        return "";
    }
    /**
     * 点击跳转页面
     */
    onCurrentChange = (currentPage: number) => {
        this.loadData(currentPage);
    };
    async addChannel() {
        try {
            await request.post("/channel", this.state.form);
            this.setState({
                form: {
                    id: 0,
                    title: "",
                    key: "",
                    remark: ""
                }
            });
            this.loadData(this.pageIndex);
            Notification.success({
                message: "添加成功"
            });
        } catch (error) {
            Notification.error({
                message: error.message
            });
        }
    }
    async modifyChannel() {
        try {
            await request.post("/channel", this.state.form);
            this.setState({
                form: {
                    id: 0,
                    title: "",
                    key: "",
                    remark: ""
                }
            });
            this.loadData(this.pageIndex);
            Notification.success({
                message: "修改成功"
            });
        } catch (error) {
            Notification.error({
                message: error.message
            });
        }
    }
    async changeStatus(id: number, status: number) {
        try {
            await request.post("/channel/change/" + id, { status });
            this.loadData(this.pageIndex);
        } catch (error) {
            Notification.error({
                message: error.message
            });
        }
    }

    modify(data: any) {
        this.setState({
            form: {
                id: data.id,
                key: data.key,
                title: data.title,
                remark: data.remark
            }
        });
    }

    cancel() {
        this.setState({
            form: {
                id: 0,
                key: "",
                title: "",
                remark: ""
            }
        });
    }
}
