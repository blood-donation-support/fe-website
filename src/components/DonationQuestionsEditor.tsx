import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";

const initialQuestions = [
  "Họ và tên",
  "Ngày sinh",
  "Giới tính",
  "Số CMND/CCCD",
  "Địa chỉ liên hệ",
  "Số điện thoại",
  "Email",
  "Chiều cao (cm)",
  "Cân nặng (kg)",
  "Bạn có đang mang thai hoặc cho con bú không?",
  "Bạn có xăm mình trong vòng 6 tháng qua không?",
  "Bạn đang sử dụng thuốc điều trị không?",
  "Bạn có hút thuốc hoặc uống rượu thường xuyên không?",
  "Bạn có đang bị bệnh cấp tính như sốt, ho, cảm cúm không?",
];

const QuestionItem = ({ question, index, moveQuestion, removeQuestion }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: "question",
    hover(item) {
      if (item.index === index) return;
      moveQuestion(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "question",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex justify-between items-center p-2 border rounded bg-white shadow-sm mb-2 ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="text-[#236afe]" />
        <span>{question}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={() => removeQuestion(index)}>
        <Trash2 className="text-red-500 w-4 h-4" />
      </Button>
    </div>
  );
};

const DonationQuestionsEditor = () => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [newQuestion, setNewQuestion] = useState("");

  const moveQuestion = (from, to) => {
    const updated = update(questions, {
      $splice: [
        [from, 1],
        [to, 0, questions[from]],
      ],
    });
    setQuestions(updated);
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions((prev) => [...prev, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="bg-[#f0f4ff]">
      <CardHeader>
        <CardTitle className="text-[#236afe] text-xl">
          Câu hỏi trước khi hiến máu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Nhập câu hỏi mới..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addQuestion()}
          />
          <Button
            onClick={addQuestion}
            className="mt-2 bg-[#236afe] hover:bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm câu hỏi
          </Button>
        </div>

        <DndProvider backend={HTML5Backend}>
          {questions.map((q, i) => (
            <QuestionItem
              key={i}
              question={q}
              index={i}
              moveQuestion={moveQuestion}
              removeQuestion={removeQuestion}
            />
          ))}
        </DndProvider>
      </CardContent>
    </Card>
  );
};

export default DonationQuestionsEditor;
