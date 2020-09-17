import React from 'react';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
// import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import './index.less';

import { get, post } from '../../service/Request';
import Utils from '../../service/Utils';
import { TagError, TagSuccess } from '../../plugin/Tag';

interface IState {
    [key: string]: any;
    list: any[];
    count: number;
    channel: string;
    key: string;
    state: number | string;
    status: number | string;
    open: boolean;
    message: string;
}

export default class App extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            count: 0,
            channel: '',
            key: '',
            state: '',
            status: '',
            open: false,
            message: '',
        };
    }
    render() {
        return (
            <div id="channel">
                <TableContainer>
                    <Table stickyHeader className="table-list">
                        <TableHead>
                            <TableRow>
                                <TableCell>频道</TableCell>
                                <TableCell>字段名</TableCell>
                                <TableCell>备注</TableCell>
                                <TableCell>创建人</TableCell>
                                <TableCell>状态</TableCell>
                                <TableCell>操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.list.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.key}</TableCell>
                                    <TableCell>{item.remark}</TableCell>
                                    <TableCell>
                                        <p>{item.nickname}</p>
                                        <small>{Utils.DateFormartString(item.updatedAt, 'yyyy.MM.dd hh:mm')}</small>
                                    </TableCell>
                                    <TableCell>{item.status === 1 ? <TagSuccess val="启用" /> : <TagError val="禁用" />}</TableCell>
                                    <TableCell>
                                        <ButtonGroup size="small" aria-label="">
                                            <Button color="primary" onClick={() => this.goEdit(item.id)}>
                                                <EditIcon />
                                            </Button>
                                            {item.status === 0 && (
                                                <Button color="primary" onClick={() => this.goPublish(item.id)}>
                                                    <PlayArrowIcon />
                                                </Button>
                                            )}
                                            {item.status === 1 && (
                                                <Button color="primary" onClick={() => this.goPause(item.id)}>
                                                    <PauseIcon />
                                                </Button>
                                            )}
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="table-footer">
                    <Pagination className="pagination" count={this.state.count} shape="rounded" />
                </div>
                <Snackbar open={this.state.open} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} message={this.state.message} onClose={this.onMessageClose} />
            </div>
        );
    }
    componentDidMount() {
        this.getList();
    }

    limit = 1;
    /**
     * 获取页面列表
     * @param pageIndex 页码
     */
    async getList(pageIndex?: number) {
        if (pageIndex) {
            this.limit = pageIndex;
        }

        try {
            const data = await get('/channel', {
                limit: this.limit,
            });
            this.setState({
                list: data.rows,
                count: Math.ceil(data.count / 20),
            });
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * 通用更新键值
     * @param elem 来源
     * @param keyName 键名
     */
    onSearchChange = (elem: React.ChangeEvent<{ value: unknown }>, keyName: string) => {
        const data = {
            [keyName]: elem.target.value,
        };
        this.setState(data);
    };

    goEdit(id: number) {
        this.props.history.push('/test');
    }
    /**
     * 启用
     * @param id id
     */
    async goPublish(id: number) {
        try {
            await post('/channel/change/' + id, { status: 1 });
            this.getList();
            this.showMessage('已启用');
        } catch (error) {
            console.log(error);
            this.showMessage(error.message);
        }
    }
    /**
     * 禁用
     * @param id id
     */
    async goPause(id: number) {
        try {
            await post('/channel/change/' + id, { status: 0 });
            this.getList();
            this.showMessage('已禁用');
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
