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
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import './index.less';

import { get, post } from '../../service/Request';
import Utils from '../../service/Utils';
import { TagError, TagSuccess, TagInfo, TagRem, TagBlu } from '../../plugin/Tag';

interface IState {
    [key: string]: any;
    channel_list: any[];
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
            channel_list: [],
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
            <div id="configs">
                <div className="top-box">
                    <FormControl className="item">
                        <InputLabel id="label-channel">频道</InputLabel>
                        <Select labelId="label-channel" value={this.state.channel} onChange={(e) => this.onSearchChange(e, 'channel')} className="channel">
                            <MenuItem value={''}>
                                <span className="project-item">所有</span>
                            </MenuItem>
                            {this.state.channel_list.map((item, index) => (
                                <MenuItem value={item.key} key={index}>
                                    <span className="project-item">
                                        {item.title}&nbsp;{item.key}
                                    </span>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField className="item" label="字段名" value={this.state.key} onChange={(e) => this.onSearchChange(e, 'key')} />
                    <FormControl className="item">
                        <InputLabel id="label-type">类型</InputLabel>
                        <Select labelId="label-type" value={this.state.state} onChange={(e) => this.onSearchChange(e, 'state')} className="channel">
                            <MenuItem value={''}>
                                <span className="project-item">所有</span>
                            </MenuItem>
                            <MenuItem value={0}>
                                <span className="project-item">普通</span>
                            </MenuItem>
                            <MenuItem value={1}>
                                <span className="project-item">定时</span>
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className="item">
                        <InputLabel id="label-status">状态</InputLabel>
                        <Select labelId="label-status" value={this.state.status} onChange={(e) => this.onSearchChange(e, 'status')} className="channel">
                            <MenuItem value={''}>
                                <span className="project-item">所有</span>
                            </MenuItem>
                            <MenuItem value={0}>
                                <span className="project-item">暂停</span>
                            </MenuItem>
                            <MenuItem value={1}>
                                <span className="project-item">启用</span>
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className="item">
                        <Button className="btn-search" variant="contained" color="primary" onClick={() => this.getList(1)}>
                            查询
                        </Button>
                    </FormControl>
                </div>
                <TableContainer>
                    <Table stickyHeader className="table-list">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">频道</TableCell>
                                <TableCell>标题和key</TableCell>
                                <TableCell align="center">内容</TableCell>
                                <TableCell>类型</TableCell>
                                <TableCell>状态</TableCell>
                                <TableCell align="center">操作人</TableCell>
                                <TableCell align="center">操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.list.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.channel_title}</TableCell>
                                    <TableCell>
                                        <p>{item.title}</p>
                                        <small>{item.key}</small>
                                    </TableCell>
                                    <TableCell>
                                        <div className="item-val">
                                            {item.key_type === 'image' && <img className="img" src={item.val} alt="" />}
                                            {item.key_type !== 'image' && <span className="txts">{item.val}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.state === 0 && <TagInfo val="普通任务" />}
                                        {item.state === 1 && <TagRem val="定时任务" />}
                                        {item.state === 2 && <TagBlu val="灰度任务" />}
                                    </TableCell>
                                    <TableCell>
                                        {item.status === 1 ? <TagSuccess val="生效" /> : <TagError val="暂停" />}
                                        <a className="linkto" href={'/api_config/configs/' + item.id} target="_blank" rel="noopener noreferrer">
                                            预览
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <p>{item.nickname}</p>
                                        <small>{Utils.DateFormartString(item.updatedAt, 'yyyy.MM.dd hh:mm')}</small>
                                    </TableCell>
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
                                            <Button color="secondary" disabled={item.status !== 0} onClick={() => this.goDelete(item.id)}>
                                                <DeleteForeverIcon />
                                            </Button>
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
        this.getAllChannel();
        this.getList();
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
    limit = 1;
    /**
     * 获取页面列表
     * @param pageIndex 页码
     */
    async getList(pageIndex?: number) {
        if (pageIndex) {
            this.limit = pageIndex;
        }
        let opts: any = {
            limit: this.limit,
        };
        if (this.state.channel) {
            opts.channel = this.state.channel;
        }
        if (this.state.key) {
            opts.key = this.state.key;
        }
        if (this.state.state !== '') {
            opts.state = this.state.state;
        }
        if (this.state.status !== '') {
            opts.status = this.state.status;
        }
        try {
            const data = await get('/configs', opts);
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
        this.props.history.push('/detail?id=' + id);
    }
    /**
     * 发布
     * @param id id
     */
    async goPublish(id: number) {
        try {
            const data = await post('/configs/publish/' + id);
            console.log(data);
            this.getList();
            this.showMessage('已启动');
        } catch (error) {
            console.log(error);
            this.showMessage(error.message);
        }
    }
    /**
     * 暂停
     * @param id id
     */
    async goPause(id: number) {
        try {
            const data = await post('/configs/pause/' + id);
            console.log(data);
            this.getList();
            this.showMessage('已暂停');
        } catch (error) {
            console.log(error);
            this.showMessage(error.message);
        }
    }
    async goDelete(id: number) {
        try {
            const data = await post('/configs/del/' + id);
            console.log(data);
            this.getList();
            this.showMessage('已删除');
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
    test(id: number) {
        console.log(id);
    }
}
