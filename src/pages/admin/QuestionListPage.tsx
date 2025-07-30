import React, { useEffect, useState } from "react";
import { Plus, Trash2, HelpCircle, Shield, Edit3, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import {
	fetchQuestion,
	createQuestion,
	deleteQuestion,
} from "@/api/questionService";
import type { Question } from "@/types/question";
import { toast } from "sonner";

export default function QuestionListPage() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [newQuestion, setNewQuestion] = useState("");
	const [loading, setLoading] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const fixedQuestions = [
		{ text: "Họ tên", required: true },
		{ text: "Số điện thoại", required: true },
		{ text: "CCCD", required: true },
		{ text: "Email", required: false },
		{ text: "Nhóm máu", required: true },
		{ text: "Loại hiến", required: true },
		{ text: "Giới tính", required: true },
		{ text: "Cân nặng", required: true },
	];

	const loadQuestions = async () => {
		try {
			setLoading(true);
			const res = await fetchQuestion();
			setQuestions(res);
		} catch {
			toast.error("Không thể tải câu hỏi linh hoạt");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadQuestions();
	}, []);

	const handleCreateQuestion = async () => {
		if (!newQuestion.trim()) {
			toast.error("Nội dung câu hỏi không được để trống");
			return;
		}
		try {
			const created = await createQuestion({ name: newQuestion });
			setQuestions((prev) => [created, ...prev]);
			setNewQuestion("");
			setIsDialogOpen(false);
			toast.success("Đã thêm câu hỏi mới");
		} catch {
			toast.error("Tạo câu hỏi thất bại");
		}
	};

	const handleDeleteQuestion = async (id: string) => {
		try {
			await deleteQuestion(id);
			setQuestions((prev) => prev.filter((q) => q._id !== id));
			toast.success("Đã xoá câu hỏi thành công");
		} catch {
			toast.error("Xoá câu hỏi thất bại");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6">
			<div className="max-w-6xl mx-auto space-y-8">
				<Card className="g-gradient-to-r from-indigo-600 to-blue-500 border-0 mb-8 overflow-hidden">
					<CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
						<CardTitle className="text-2xl text-center font-bold">
							Danh sách câu hỏi đăng kí hiến máu
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6 space-y-6">
						{/* Fixed Questions */}
						<Card className="g-gradient-to-r from-indigo-600 to-blue-500 border-0 mb-8 overflow-hidden">
							<CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
								<div className="flex items-center space-x-3">
									<Shield className="w-6 h-6" />
									<div>
										<CardTitle className="text-2xl font-bold">
											Câu hỏi cố định
										</CardTitle>
										<p className="text-blue-100 text-sm mt-1">
											Thông tin bắt buộc không thể chỉnh sửa
										</p>
									</div>
								</div>
							</CardHeader>
							<CardContent className="p-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{fixedQuestions.map((q, idx) => (
										<div
											key={idx}
											className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md"
										>
											<div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
												{idx + 1}
											</div>
											<span className="text-2xl mr-3">{q.icon}</span>
											<div className="flex-1">
												<span className="font-medium text-gray-800">
													{q.text}
												</span>
												{!q.required && (
													<span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
														Tùy chọn
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Flexible Questions */}
						<Card className="g-gradient-to-r from-indigo-600 to-blue-500 border-0 mb-8 overflow-hidden">
							<CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
									<div className="flex items-center space-x-3">
										<Edit3 className="w-6 h-6" />
										<div>
											<CardTitle className="text-2xl font-bold">
												Câu hỏi linh hoạt
											</CardTitle>
											<p className="text-blue-100 text-sm mt-1">
												Câu hỏi sàng lọc có thể tùy chỉnh (Có/Không)
											</p>
										</div>
									</div>

									<Button
										className="w-100 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
										onClick={() => setIsDialogOpen(true)}
									>
										<Plus className="w-4 h-4 mr-2" />
										Thêm câu hỏi
									</Button>
								</div>
							</CardHeader>
							<CardContent className="p-6">
								{loading ? (
									<div className="flex items-center justify-center py-12">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
										<span className="ml-3 text-gray-600">Đang tải...</span>
									</div>
								) : questions.length === 0 ? (
									<div className="text-center py-12">
										<HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
										<p className="text-gray-500 text-lg">
											Chưa có câu hỏi linh hoạt nào.
										</p>
										<p className="text-gray-400 text-sm mt-2">
											Hãy thêm câu hỏi đầu tiên để bắt đầu!
										</p>
									</div>
								) : (
									<div className="space-y-3">
										{questions.map((q, idx) => (
											<div
												key={q._id}
												className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md"
											>
												<div className="flex items-center flex-1">
													<div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
														{idx + 1}
													</div>
													<span className="flex-1 text-gray-800 font-medium">
														{q.name}
													</span>
												</div>
												<div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100">
													<Button
														variant="ghost"
														size="sm"
														className="text-blue-600 hover:bg-blue-100"
														onClick={() => handleDeleteQuestion(q._id)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</CardContent>

					{/* Dialog Create */}
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogContent className="max-w-md bg-white/95 backdrop-blur-sm">
							<DialogHeader>
								<DialogTitle className="text-xl font-bold text-gray-800">
									Thêm câu hỏi mới
								</DialogTitle>
							</DialogHeader>
							<div className="space-y-4 pt-4">
								<Input
									placeholder="Ví dụ: Bạn có đang dùng thuốc kháng sinh không?"
									value={newQuestion}
									onChange={(e) => setNewQuestion(e.target.value)}
									onKeyPress={(e) =>
										e.key === "Enter" && handleCreateQuestion()
									}
									className="border-2 border-gray-200 focus:border-blue-500 rounded-lg p-3"
								/>
								<Button
									onClick={handleCreateQuestion}
									className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg shadow-md"
								>
									<Save className="w-4 h-4 mr-2" />
									Lưu câu hỏi
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</Card>
			</div>
		</div>
	);
}
