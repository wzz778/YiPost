import React, { memo, useState, useEffect, useCallback } from "react";
import type { FC, ReactNode } from "react";
import type { PaginationProps } from "antd";
import dayjs from "dayjs";
import {
  Table,
  Pagination,
  Button,
  Space,
  Form,
  Input,
  Radio,
  DatePicker,
  message,
  Modal,
  Select,
} from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  getUser,
  getAllDept,
  userAdd,
  userUpload,
  deleteUserById,
} from "@/service/modules/recommend";
interface IProps {
  children?: ReactNode;
}
// interface UserRoot {
//   id: number
//   username: string
//   password: string
//   name: string
//   gender: number
//   image: string
//   job: number
//   entrydate: string
//   deptId: number
//   createTime: string
//   updateTime: string
//   isDelete: number
//   deptName: string
// }
export interface DeptType {
  id: number;
  name: string;
  createTime: string;
  updateTime: string;
  isDelete: number;
}
const showTotal: PaginationProps["showTotal"] = (total) => `共 ${total} 页`;
const User: FC<IProps> = () => {
  const [openUpload, setUploadOpen] = useState(false);
  const columns: Array<any> = [
    {
      title: "账号",
      width: 100,
      dataIndex: "username",
      key: "name",
    },
    {
      title: "姓名",
      width: 100,
      dataIndex: "name",
      key: "name",
    },
    {
      title: "性别",
      dataIndex: "gender",
      width: 50,
      key: "gender",
      render: (_: any, { gender }: any) => <>{gender == 1 ? "女" : "男"}</>,
    },
    {
      title: "方向",
      dataIndex: "deptName",
      key: "deptName",
      width: 50,
      // render: (_: any, { dept }: any) => (
      //   <>
      //     {dept == 1 ? '后端' : '前端'}
      //   </>
      // ),
    },
    {
      title: "入职时间",
      dataIndex: "entrydate",
      key: "entrydate",
      width: 150,
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      width: 150,
      render: (data: any) => <>{data.replace("T", " ")}</>,
    },
    {
      title: "操作",
      key: "operation",
      fixed: "right",
      dataIndex: "key",
      width: 100,
      render: (_: any, record: any) => (
        <Space size="middle">
          <a onClick={() => onUserRevise(record)}>修改</a>
          <a onClick={() => onUserDelete(record)}>刪除</a>
        </Space>
      ),
    },
  ];
  const onUserRevise = (data: any) => {
    setUploadOpen(true);
    const { id, username, name, deptId, gender, entrydate } = data;
    formUpload.setFieldsValue({
      id,
      username,
      name,
      deptId,
      gender,
      entrydate: dayjs(entrydate, "YYYY-MM-DD"),
    });
  };
  const onUserDelete = (data: any) => {
    setopenConfirm(true);
    setdeleteForm({ id: data.id, name: data.name });
  };
  const [messageApi, contextHolder] = message.useMessage();
  const [listdata, setlistdata] = useState([
    {
      id: 18,
      username: "linpingzhi",
      password: "123456",
      name: "林平之",
      gender: 1,
      image:
        "https://web-framework.oss-cn-hangzhou.aliyuncs.com/2022-09-03-07-37-38222.jpg",
      job: 1,
      entrydate: "2022-09-18",
      deptId: 1,
      createTime: "2023-06-05T15:22:26",
      updateTime: "2023-06-05T15:22:26",
      isDelete: 1,
      deptName: "后端",
    },
  ]);
  const [pagination, setpagination] = useState({ page: 1, pageSize: 5 });
  const [total, setTotal] = useState(20);
  const [searchForm, setsearchForm] = useState({
    name: "",
    gender: "",
    begin: "",
    end: "",
    deptId: "",
  });
  // const key = 'updatable';
  const getUserCb = useCallback(
    () => getUser({ ...pagination, ...searchForm }),
    [pagination, searchForm]
  );
  useEffect(() => {
    // messageApi.open({
    //   key,
    //   type: 'loading',
    //   content: 'Loading...',
    // });
    getUserCb()
      .then((res) => {
        setlistdata(res.data.rows);
        setTotal(res.data.total);
        // console.log(res.data);
        messageApi.open({
          type: "success",
          content: "查询成功!",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getUserCb]);
  const onChange: PaginationProps["onChange"] = (pageNumber) => {
    setpagination({ pageSize: 5, page: pageNumber });
  };
  const [form] = Form.useForm();
  const [formADD] = Form.useForm();
  const [formUpload]: any = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
  const onFinish = (values: any) => {
    onReset();
    if (values.time) {
      setsearchForm({
        name: values.name,
        gender: values.gender,
        begin: values.time[0].format("YYYY-MM-DD"),
        end: values.time[1].format("YYYY-MM-DD"),
        deptId: values.deptId,
      });
    } else {
      setsearchForm({
        name: values.name,
        gender: values.gender,
        begin: "",
        end: "",
        deptId: values.deptId,
      });
    }
  };

  const onAddOk = async () => {
    try {
      const values = await formADD.validateFields();
      const newEntrydata = values.entrydate
        ? values.entrydate.format("YYYY-MM-DD")
        : "";
      if (newEntrydata != "") {
        values.entrydate = newEntrydata;
      }
      const formAdd = JSON.stringify(values);
      const res = await userAdd(formAdd);
      if (res.code == 1) {
        setpagination({ ...pagination });
        message.success("添加成功！");
        setOpenADD(false);
        formADD.resetFields();
      } else {
        message.error("添加失败！");
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  const onUploadOk = async () => {
    try {
      const values = await formUpload.validateFields();
      const newEntrydata = values.entrydate
        ? values.entrydate.format("YYYY-MM-DD")
        : "";
      if (newEntrydata != "") {
        values.entrydate = newEntrydata;
      }
      const formAdd = JSON.stringify({ id: values.id, ...values });
      console.log(formAdd);

      const res = await userUpload(formAdd);
      if (res.code == 1) {
        setpagination({ ...pagination });
        message.success("修改成功！");
        setUploadOpen(false);
        formUpload.resetFields();
      } else {
        message.error("修改失败！");
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  //打开添加框
  const [openADD, setOpenADD] = useState(false);
  const validateMessages = {
    required: "请填写您要添加的${label}!",
    types: {
      email: "$您输入的{label}不合理 ! ",
      number: "$您输入的{label}不合理 ! ",
      string: "$您输入的{label}不合理 !",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
    string: {
      range: "${label} 应该在 ${min} 到 ${max} 之间",
    },
  };
  const [deptList, setdeptList] = useState<DeptType[]>([]);
  useEffect(() => {
    (async function () {
      const res = await getAllDept();
      setdeptList(res.data);
    })();
  }, []);

  const deleteIDFn = async () => {
    try {
      const res = await deleteUserById({ id: deleteForm.id });
      if (res.code == 1) {
        setpagination({ ...pagination });
        message.success("删除成功！");
        setopenConfirm(false);
      } else {
        message.error("修改失败！");
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  const [openConfirm, setopenConfirm] = useState(false);
  const [deleteForm, setdeleteForm] = useState({ id: 1, name: "啊" });
  return (
    <div>
      {contextHolder}
      <Modal
        title="Modal"
        open={openConfirm}
        onOk={deleteIDFn}
        onCancel={() => setopenConfirm(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>
          你确认删除 <span style={{ color: "#1677FF" }}>{deleteForm.name}</span>{" "}
          的用户信息吗？
        </p>
      </Modal>
      <Modal
        title="添加用户"
        centered
        open={openADD}
        onOk={onAddOk}
        onCancel={() => setOpenADD(false)}
        width={400}
        cancelText="取消"
        okText="添加"
      >
        <Form
          layout="horizontal"
          form={formADD}
          size="large"
          style={{ marginBottom: "10px" }}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 14 }}
          validateMessages={validateMessages}
          name="addFormName"
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true }, { type: "string", min: 0, max: 9 }]}
          >
            <Input placeholder="请填写账号" style={{ width: "250px" }} />
          </Form.Item>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true }, { type: "string", min: 0, max: 9 }]}
          >
            <Input placeholder="请填写姓名" style={{ width: "250px" }} />
          </Form.Item>
          <Form.Item label="性别" name="gender">
            <Radio.Group>
              <Radio value="2" defaultChecked>
                男
              </Radio>
              <Radio value="1">女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="部门" name="deptId">
            <Select>
              {deptList.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="入职日期" name="entrydate">
            <DatePicker style={{ width: "240px" }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="修改用户信息"
        centered
        open={openUpload}
        onOk={onUploadOk}
        onCancel={() => setUploadOpen(false)}
        width={400}
        cancelText="取消"
        okText="修改"
      >
        <Form
          layout="horizontal"
          form={formUpload}
          size="large"
          style={{ marginBottom: "10px" }}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 14 }}
          validateMessages={validateMessages}
          name="addFormName"
        >
          <Form.Item style={{ display: "none" }} label="id" name="id">
            <Input />
          </Form.Item>
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true }, { type: "string", min: 0, max: 9 }]}
          >
            <Input placeholder="请填写账号" style={{ width: "250px" }} />
          </Form.Item>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true }, { type: "string", min: 0, max: 9 }]}
          >
            <Input placeholder="请填写姓名" style={{ width: "250px" }} />
          </Form.Item>
          <Form.Item label="性别" name="gender">
            <Select>
              <Select.Option value={2}>男</Select.Option>
              <Select.Option value={1}>女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="部门" name="deptId">
            <Select>
              {deptList.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="入职日期" name="entrydate">
            <DatePicker style={{ width: "240px" }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
      <Form
        layout="inline"
        form={form}
        size="large"
        style={{ margin: "0 0 10px 10px" }}
        onFinish={onFinish}
      >
        <Form.Item label="查询" name="name">
          <Input placeholder="模糊查询" style={{ width: "100px" }} />
        </Form.Item>
        <Form.Item label="性别" name="gender">
          <Radio.Group>
            <Radio.Button value="2">男</Radio.Button>
            <Radio.Button value="1">女</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="日期" name="time">
          <DatePicker.RangePicker
            style={{ width: "240px" }}
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Form.Item label="部门" name="deptId" style={{ width: "150px" }}>
          <Select>
            {deptList.map((item) => {
              return (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
            搜索
          </Button>
        </Form.Item>
        <Button
          onClick={() => setOpenADD(true)}
          style={{ backgroundColor: "#0DD068" }}
          type="primary"
          icon={<UserAddOutlined />}
        >
          添加
        </Button>
      </Form>
      <Table
        columns={columns}
        bordered
        dataSource={listdata}
        pagination={false}
        rowKey={(listdata) => listdata.id}
        scroll={{
          x: "100%",
        }}
      />
      <Pagination
        style={{ float: "right", padding: "10px 20px" }}
        defaultCurrent={1}
        total={total}
        showQuickJumper
        pageSize={pagination.pageSize}
        current={pagination.page}
        showTotal={showTotal}
        onChange={onChange}
      />
    </div>
  );
};

export default memo(User);
