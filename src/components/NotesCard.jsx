import { Card, Space } from "antd";

const NotesCard = ({ notesContent }) => {
  return (
    <Space direction="vertical" size={16}>
      <Card
        size="small"
        title=""
        extra={<a href="#">X</a>}
        style={{
          width: 300,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: notesContent }}></div>
      </Card>
    </Space>
  );
};

export default NotesCard;
