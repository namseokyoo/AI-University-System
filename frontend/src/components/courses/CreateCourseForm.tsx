'use client';

import React, { useState } from 'react';
import { CourseCreateRequest, AICourseCreateRequest, DifficultyLevel, DIFFICULTY_LABELS } from '@/types/course';
import { courseService } from '@/lib/courseService';
import { BookOpen, Bot, Clock, Target, Users, Tag, Plus, X } from 'lucide-react';

interface CreateCourseFormProps {
    onSuccess?: (courseId: string) => void;
    onCancel?: () => void;
}

export default function CreateCourseForm({ onSuccess, onCancel }: CreateCourseFormProps) {
    const [isAIMode, setIsAIMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 일반 코스 생성 폼
    const [courseData, setCourseData] = useState<CourseCreateRequest>({
        title: '',
        description: '',
        difficulty_level: 'beginner',
        estimated_duration_hours: undefined,
        learning_objectives: [],
        target_audience: [],
        tags: [],
        categories: []
    });

    // AI 코스 생성 폼
    const [aiCourseData, setAiCourseData] = useState<AICourseCreateRequest>({
        topic: '',
        difficulty_level: 'beginner',
        target_hours: 10,
        additional_requirements: ''
    });

    // 동적 입력 관리
    const [newObjective, setNewObjective] = useState('');
    const [newAudience, setNewAudience] = useState('');
    const [newTag, setNewTag] = useState('');
    const [newCategory, setNewCategory] = useState('');

    // 리스트 아이템 추가 함수
    const addListItem = (
        field: 'learning_objectives' | 'target_audience' | 'tags' | 'categories',
        value: string,
        setValue: (value: string) => void
    ) => {
        if (value.trim()) {
            setCourseData(prev => ({
                ...prev,
                [field]: [...(prev[field] || []), value.trim()]
            }));
            setValue('');
        }
    };

    // 리스트 아이템 제거 함수
    const removeListItem = (
        field: 'learning_objectives' | 'target_audience' | 'tags' | 'categories',
        index: number
    ) => {
        setCourseData(prev => ({
            ...prev,
            [field]: (prev[field] || []).filter((_, i) => i !== index)
        }));
    };

    // 일반 코스 생성
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!courseData.title.trim() || !courseData.description.trim()) {
            setError('제목과 설명은 필수 입력 항목입니다.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const course = await courseService.createCourse(courseData);

            if (onSuccess) {
                onSuccess(course.id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '코스 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // AI 코스 생성
    const handleAISubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!aiCourseData.topic.trim()) {
            setError('코스 주제는 필수 입력 항목입니다.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const course = await courseService.createAICourse(aiCourseData);

            if (onSuccess) {
                onSuccess(course.id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'AI 코스 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* 헤더 */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">새 코스 만들기</h2>
                <p className="text-gray-600">
                    직접 코스를 만들거나 AI의 도움을 받아 자동으로 생성할 수 있습니다.
                </p>
            </div>

            {/* 모드 선택 */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setIsAIMode(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${!isAIMode
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <BookOpen className="w-5 h-5" />
                    <div>
                        <div className="font-medium">직접 만들기</div>
                        <div className="text-sm text-gray-500">수동으로 코스 정보 입력</div>
                    </div>
                </button>

                <button
                    onClick={() => setIsAIMode(true)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${isAIMode
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <Bot className="w-5 h-5" />
                    <div>
                        <div className="font-medium">AI로 생성</div>
                        <div className="text-sm text-gray-500">AI가 자동으로 구조 생성</div>
                    </div>
                </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* AI 모드 폼 */}
            {isAIMode ? (
                <form onSubmit={handleAISubmit} className="space-y-6">
                    {/* 주제 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            코스 주제 *
                        </label>
                        <input
                            type="text"
                            required
                            value={aiCourseData.topic}
                            onChange={(e) => setAiCourseData(prev => ({ ...prev, topic: e.target.value }))}
                            placeholder="예: 머신러닝 기초, React 개발, 데이터 분석"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* 난이도 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            난이도
                        </label>
                        <select
                            value={aiCourseData.difficulty_level}
                            onChange={(e) => setAiCourseData(prev => ({
                                ...prev,
                                difficulty_level: e.target.value as DifficultyLevel
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* 목표 시간 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            목표 학습 시간
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="1"
                                max="200"
                                value={aiCourseData.target_hours}
                                onChange={(e) => setAiCourseData(prev => ({
                                    ...prev,
                                    target_hours: parseInt(e.target.value) || 10
                                }))}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="text-gray-700">시간</span>
                        </div>
                    </div>

                    {/* 추가 요구사항 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            추가 요구사항 (선택)
                        </label>
                        <textarea
                            value={aiCourseData.additional_requirements}
                            onChange={(e) => setAiCourseData(prev => ({
                                ...prev,
                                additional_requirements: e.target.value
                            }))}
                            placeholder="특별한 요구사항이나 포함하고 싶은 내용을 설명해주세요..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    AI가 코스를 생성하는 중...
                                </>
                            ) : (
                                <>
                                    <Bot className="w-4 h-4" />
                                    AI로 코스 생성
                                </>
                            )}
                        </button>

                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                취소
                            </button>
                        )}
                    </div>
                </form>
            ) : (
                /* 일반 모드 폼 */
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 기본 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 제목 */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                코스 제목 *
                            </label>
                            <input
                                type="text"
                                required
                                value={courseData.title}
                                onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="매력적이고 명확한 코스 제목을 입력하세요"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* 난이도 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                난이도
                            </label>
                            <select
                                value={courseData.difficulty_level}
                                onChange={(e) => setCourseData(prev => ({
                                    ...prev,
                                    difficulty_level: e.target.value as DifficultyLevel
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* 예상 시간 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                예상 학습 시간
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="200"
                                    value={courseData.estimated_duration_hours || ''}
                                    onChange={(e) => setCourseData(prev => ({
                                        ...prev,
                                        estimated_duration_hours: e.target.value ? parseInt(e.target.value) : undefined
                                    }))}
                                    placeholder="10"
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="text-gray-700">시간</span>
                            </div>
                        </div>
                    </div>

                    {/* 설명 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            코스 설명 *
                        </label>
                        <textarea
                            required
                            value={courseData.description}
                            onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="코스의 내용, 목표, 특징 등을 상세히 설명해주세요..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* 학습 목표 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Target className="inline w-4 h-4 mr-1" />
                            학습 목표
                        </label>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newObjective}
                                    onChange={(e) => setNewObjective(e.target.value)}
                                    placeholder="학습 목표를 입력하세요"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addListItem('learning_objectives', newObjective, setNewObjective);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => addListItem('learning_objectives', newObjective, setNewObjective)}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {courseData.learning_objectives && courseData.learning_objectives.length > 0 && (
                                <div className="space-y-1">
                                    {courseData.learning_objectives.map((objective, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                            <span className="flex-1">{objective}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeListItem('learning_objectives', index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 대상 학습자 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Users className="inline w-4 h-4 mr-1" />
                            대상 학습자
                        </label>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newAudience}
                                    onChange={(e) => setNewAudience(e.target.value)}
                                    placeholder="대상 학습자를 입력하세요"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addListItem('target_audience', newAudience, setNewAudience);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => addListItem('target_audience', newAudience, setNewAudience)}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {courseData.target_audience && courseData.target_audience.length > 0 && (
                                <div className="space-y-1">
                                    {courseData.target_audience.map((audience, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                            <span className="flex-1">{audience}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeListItem('target_audience', index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 태그 & 카테고리 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 태그 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Tag className="inline w-4 h-4 mr-1" />
                                태그
                            </label>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="태그 입력"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addListItem('tags', newTag, setNewTag);
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addListItem('tags', newTag, setNewTag)}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {courseData.tags && courseData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {courseData.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeListItem('tags', index)}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 카테고리 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                카테고리
                            </label>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        placeholder="카테고리 입력"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addListItem('categories', newCategory, setNewCategory);
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addListItem('categories', newCategory, setNewCategory)}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {courseData.categories && courseData.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {courseData.categories.map((category, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                            >
                                                {category}
                                                <button
                                                    type="button"
                                                    onClick={() => removeListItem('categories', index)}
                                                    className="text-green-600 hover:text-green-700"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    코스 생성 중...
                                </>
                            ) : (
                                <>
                                    <BookOpen className="w-4 h-4" />
                                    코스 생성
                                </>
                            )}
                        </button>

                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                취소
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
} 