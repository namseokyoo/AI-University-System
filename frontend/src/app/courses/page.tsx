'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CourseList from '@/components/courses/CourseList';
import CreateCourseForm from '@/components/courses/CreateCourseForm';
import { Modal } from '@/components/ui/Modal';
import { BookOpen, Plus } from 'lucide-react';

export default function CoursesPage() {
    const { user } = useAuth();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCourseCreated = (courseId: string) => {
        setShowCreateForm(false);
        setRefreshKey(prev => prev + 1); // 코스 목록 새로고침
        // 생성된 코스 페이지로 이동
        window.location.href = `/courses/${courseId}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">코스 목록</h1>
                                <p className="text-sm text-gray-600">AI로 학습하는 온라인 코스</p>
                            </div>
                        </div>

                        {user && (
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                새 코스 만들기
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <CourseList
                    key={refreshKey}
                    showFilters={true}
                    showCreateButton={false}
                    onCourseClick={(course) => {
                        window.location.href = `/courses/${course.slug}`;
                    }}
                />
            </div>

            {/* 코스 생성 모달 */}
            {showCreateForm && (
                <Modal
                    isOpen={showCreateForm}
                    onClose={() => setShowCreateForm(false)}
                    title="새 코스 만들기"
                >
                    <CreateCourseForm
                        onSuccess={handleCourseCreated}
                        onCancel={() => setShowCreateForm(false)}
                    />
                </Modal>
            )}
        </div>
    );
} 