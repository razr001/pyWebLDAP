import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";
import styles from "./index.less";

export default
@Form.create()
class FormBox extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    layout: PropTypes.object,
    itemStyle: PropTypes.object,
    itemGroups: PropTypes.array
  };

  static defaultProps = {
    items: [
      // {
      //   label: '角色名称',
      //   key: 'roleName',
      //   field: {
      //     rules: [{ required: true, message: '此项不能为空' }], // Form.getFieldDecorator
      //     initialValue:''
      //   },
      //   style:{}
      //   layout:{},
      //  hide: false,
      // invisible:false,
      //  comp: <Input />
      // },
    ],
    layout: {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      }
    },
    itemStyle: {},

    itemGroups: [
      // {
      //   title: '',
      //   items: [],
      // },
    ]
  };

  formItemRender = items => {
    const { form, itemStyle, layout } = this.props;
    const { getFieldDecorator } = form;
    return items.map(item => {
      if (item.hide) return null;
      const formLayout = item.layout || layout;
      return (
        <Form.Item
          key={item.key}
          label={item.invisible ? "" : item.label}
          {...formLayout}
          style={{ ...itemStyle, ...item.style }}
          className={styles.formItem}
        >
          {item.key &&
            !item.invisible &&
            getFieldDecorator(item.key, {
              ...item.field
            })(item.comp ? item.comp : <Input />)}
        </Form.Item>
      );
    });
  };

  render() {
    const {
      items,
      form,
      layout,
      itemStyle,
      children,
      itemGroups,
      ...props
    } = this.props;
    return (
      <Form {...props}>
        {itemGroups &&
          itemGroups.map((group, index) => {
            const key = `item_${index}`;
            return (
              <div
                key={key}
                style={{
                  borderBottom: "1px solid #F3F3F3",
                  margin: "0 0 24px 0"
                }}
              >
                <h2 id={group.id}>{group.title}</h2>
                {this.formItemRender(group.items)}
              </div>
            );
          })}
        {this.formItemRender(items)}
        {children}
      </Form>
    );
  }
}
