import React from 'react';
import {
    Button,
    Dialog,
    Table,
    Pagination,
    Notification,
    Tooltip
} from 'element-react';
import './index.css';
import request from '../../services/request';

interface iProps {}
interface iState {
    form: {
        title: string;
        key: string;
        remark: string;
        id: number;
    };
    cid: number;
    columns: Array<any>;
    list: Array<any>;
    count: number;
    dialogVisible: boolean;
}

function replaceDate(time: string) {
    if (!time) return '';
    return time.replace('T', ' ').replace('.000Z', '');
}

export default class extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            cid: props.match.params.id,
            form: {
                id: 0,
                title: '',
                key: '',
                remark: ''
            },
            count: 0,
            columns: this.columns,
            list: [],
            dialogVisible: false
        };
    }

    /**
     * 表格的表头属性
     */
    columns = [
        {
            label: '频道',
            width: 100,
            prop: 'channel_title',
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
                            <img
                                alt={row.val}
                                className="table_img"
                                src={row.val}
                            />
                        </Tooltip>
                    </div>
                );
            }
        },
        {
            label: '操作人',
            prop: 'nickname',
            width: 100,
            className: 'list_small'
        },
        {
            label: '修改日期',
            prop: 'nickname',
            width: 180,
            className: 'list_small',
            render: function(row: any) {
                return <span>{replaceDate(row.updatedAt)}</span>;
            }
        },
        {
            label: '配置类型',
            prop: 'state',
            width: 100,
            className: 'list_small',
            render: function(row: any) {
                if (row.state === 0)
                    return <span className="used">普通配置</span>;
                if (row.state === 1)
                    return <span className="task">定时任务</span>;
            }
        },
        {
            label: '操作',
            width: 90,
            render: (row: any) => {
                return (
                    <Button
                        onClick={() => this.reback(row.id)}
                        type="info"
                        size="small"
                    >
                        回退
                    </Button>
                );
            }
        }
    ];

    render() {
        return (
            <div id="config_list">
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
                <Dialog
                    title="提示"
                    size="tiny"
                    visible={this.state.dialogVisible}
                    onCancel={() => this.setState({ dialogVisible: false })}
                >
                    <Dialog.Body>
                        <span>确定要回滚这次的配置？</span>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button
                            onClick={() =>
                                this.setState({ dialogVisible: false })
                            }
                        >
                            取消
                        </Button>
                        <Button type="primary" onClick={() => this.BackSure()}>
                            确定
                        </Button>
                    </Dialog.Footer>
                </Dialog>
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
            let data = await request.get('/record', {
                cid: this.state.cid,
                limit: pageIndex
            });
            this.setState({
                count: data.count,
                list: data.rows
            });
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * 根据状态选择
     * @param row
     * @param index
     */
    rowClassName(row: any, index: number) {
        return '';
    }
    /**
     * 点击跳转页面
     */
    onCurrentChange = (currentPage: number) => {
        this.loadData(currentPage);
    };
    id = 0;
    async reback(id: number) {
        this.id = id;
        this.setState({ dialogVisible: true });
    }
    async BackSure() {
        try {
            await request.post('/record/back/' + this.id);
            this.loadData(this.pageIndex);
            Notification.success({
                message: "回退已完成"
            });
            this.setState({ dialogVisible: false });
        } catch (error) {
            Notification.error({
                message: error.message
            });
        }
        this.id = 0;
    }
}
