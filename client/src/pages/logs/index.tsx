import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import './index.less';

import { get } from '../../service/Request';
import Utils from '../../service/Utils';

interface IModel {
    [key: string]: number | string;
    id: number;
    key: string;
    title: string;
    remark: string;
}

interface IState {
    list: any[];
    count: number;
    open: boolean;
}

export default class App extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            count: 0,
            open: false,
        };
    }
    render() {
        return (
            <div id="channel">
                <TableContainer>
                    <Table stickyHeader className="table-list">
                        <TableHead>
                            <TableRow>
                                <TableCell>日志</TableCell>
                                <TableCell>日志内容</TableCell>
                                <TableCell>备注</TableCell>
                                <TableCell>操作人/日期</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.list.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.txts}</TableCell>
                                    <TableCell>{item.remark}</TableCell>
                                    <TableCell>
                                        <p>{item.nickname}</p>
                                        <small>{Utils.DateFormartString(item.updatedAt, 'yyyy.MM.dd hh:mm')}</small>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="table-footer">
                    <Pagination className="pagination" count={this.state.count} shape="rounded" />
                </div>
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
            const data = await get('/logs', {
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
}
