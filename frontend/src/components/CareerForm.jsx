import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import useCareerStore from '../stores/useCareerStore';

const CareerForm = ({ career = null, onClose, onSuccess }) => {
    const { createCareer, updateCareer, isLoading } = useCareerStore();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: 'Full-time',
        department: '',
        requirements: [''],
        responsibilities: [''],
        qualifications: [''],
        salary: {
            min: '',
            max: '',
            currency: 'USD'
        },
        experienceLevel: 'Entry Level',
        applicationDeadline: '',
        isActive: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (career) {
            setFormData({
                ...career,
                applicationDeadline: career.applicationDeadline 
                    ? new Date(career.applicationDeadline).toISOString().split('T')[0] 
                    : '',
                salary: {
                    min: career.salary?.min || '',
                    max: career.salary?.max || '',
                    currency: career.salary?.currency || 'USD'
                }
            });
        }
    }, [career]);

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
    const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('salary.')) {
            const salaryField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                salary: {
                    ...prev.salary,
                    [salaryField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleArrayChange = (arrayName, index, value) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (arrayName) => {
        setFormData(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], '']
        }));
    };

    const removeArrayItem = (arrayName, index) => {
        if (formData[arrayName].length > 1) {
            setFormData(prev => ({
                ...prev,
                [arrayName]: prev[arrayName].filter((_, i) => i !== index)
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';

        // Validate array fields
        const requirements = formData.requirements.filter(req => req.trim());
        if (requirements.length === 0) newErrors.requirements = 'At least one requirement is needed';

        const responsibilities = formData.responsibilities.filter(resp => resp.trim());
        if (responsibilities.length === 0) newErrors.responsibilities = 'At least one responsibility is needed';

        // Validate salary if provided
        if (formData.salary.min && formData.salary.max) {
            if (parseFloat(formData.salary.min) >= parseFloat(formData.salary.max)) {
                newErrors.salary = 'Minimum salary must be less than maximum salary';
            }
        }

        // Validate deadline
        if (formData.applicationDeadline) {
            const deadlineDate = new Date(formData.applicationDeadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (deadlineDate < today) {
                newErrors.applicationDeadline = 'Application deadline must be in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            // Clean up form data
            const submitData = {
                ...formData,
                requirements: formData.requirements.filter(req => req.trim()),
                responsibilities: formData.responsibilities.filter(resp => resp.trim()),
                qualifications: formData.qualifications.filter(qual => qual.trim()),
                salary: {
                    min: formData.salary.min ? parseFloat(formData.salary.min) : undefined,
                    max: formData.salary.max ? parseFloat(formData.salary.max) : undefined,
                    currency: formData.salary.currency
                },
                applicationDeadline: formData.applicationDeadline || undefined
            };

            let result;
            if (career) {
                result = await updateCareer(submitData);
            } else {
                result = await createCareer(submitData);
            }

            onSuccess && onSuccess(result);
            onClose();
        } catch (error) {
            console.error('Error submitting career form:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto text-gray-900"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {career ? 'Edit Career Post' : 'Create New Career Post'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Title *
                                </label>                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                                        errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Senior Software Engineer"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department *
                                </label>                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                                        errors.department ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., Engineering, Marketing, Sales"
                                />
                                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description *
                            </label>                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Brief description of the role..."
                            ></textarea>
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </label>                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                                        errors.location ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., New York, Remote"
                                />
                                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Type *
                                </label>                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                >
                                    {jobTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience Level *
                                </label>                                <select
                                    name="experienceLevel"
                                    value={formData.experienceLevel}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                >
                                    {experienceLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Salary Information */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">                                <div>
                                    <input
                                        type="number"
                                        name="salary.min"
                                        value={formData.salary.min}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                        placeholder="Minimum salary"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="salary.max"
                                        value={formData.salary.max}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                        placeholder="Maximum salary"
                                    />
                                </div>
                                <div>
                                    <select
                                        name="salary.currency"
                                        value={formData.salary.currency}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                        <option value="BDT">BDT</option>
                                    </select>
                                </div>
                            </div>
                            {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Application Deadline
                            </label>                            <input
                                type="date"
                                name="applicationDeadline"
                                value={formData.applicationDeadline}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                                    errors.applicationDeadline ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.applicationDeadline && <p className="mt-1 text-sm text-red-600">{errors.applicationDeadline}</p>}
                        </div>

                        {/* Dynamic Arrays */}
                        {['requirements', 'responsibilities', 'qualifications'].map((arrayName) => (
                            <div key={arrayName}>
                                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                    {arrayName} {arrayName === 'requirements' || arrayName === 'responsibilities' ? '*' : ''}
                                </label>
                                {formData[arrayName].map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2">                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleArrayChange(arrayName, index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                            placeholder={`Add ${arrayName.slice(0, -1)}...`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem(arrayName, index)}
                                            className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                                            disabled={formData[arrayName].length === 1}
                                        >
                                            <FaMinus />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem(arrayName)}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    <FaPlus /> Add {arrayName.slice(0, -1)}
                                </button>
                                {errors[arrayName] && <p className="mt-1 text-sm text-red-600">{errors[arrayName]}</p>}
                            </div>
                        ))}

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                                Active (visible to public)
                            </label>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : (career ? 'Update Career' : 'Create Career')}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CareerForm;
