import * as React from 'react'
import { Table, Divider, Tag, Row, Card } from 'antd'

class Users extends React.Component {
  private readonly columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a href='javascript:;'>{text}</a>
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: any) => (
        <span>
          {tags.map((tag: any) => {
            let color = tag.length > 5 ? 'geekblue' : 'green'
            if (tag === 'loser') {
              color = 'volcano'
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            )
          })}
        </span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: any) => (
        <span>
          <a href='javascript:;'>Invite {record.name}</a>
          <Divider type='vertical' />
          <a href='javascript:;'>Delete</a>
        </span>
      )
    }
  ];

  private readonly data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer']
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser']
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher']
    }
  ];

  public render (): JSX.Element {
    return (
      <Row gutter={16}>
        <Card>
          <Table columns={this.columns} dataSource={this.data} />
        </Card>
      </Row>
    )
  }
}

export default Users