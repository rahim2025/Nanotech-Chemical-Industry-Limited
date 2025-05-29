import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaUsers, FaDollarSign, FaCalendarAlt, FaChevronDown, FaChevronUp, FaEnvelope } from 'react-icons/fa';
import useCareerStore from '../stores/useCareerStore';

const Career = () => {
    const { careers, isLoading, fetchCareers } = useCareerStore();
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        fetchCareers();
    }, [fetchCareers]);    const toggleExpand = (careerId) => {
        setExpandedCard(expandedCard === careerId ? null : careerId);
    };

    const formatSalary = (salary) => {
        if (!salary || (!salary.min && !salary.max)) return 'Competitive';
        
        const { min, max, currency = 'USD' } = salary;
        if (min && max) {
            return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
        } else if (min) {
            return `${currency} ${min.toLocaleString()}+`;
        } else if (max) {
            return `Up to ${currency} ${max.toLocaleString()}`;
        }
        return 'Competitive';
    };

    const isDeadlinePassed = (deadline) => {
        if (!deadline) return false;
        return new Date(deadline) < new Date();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl font-bold mb-6"
                    >
                        Join Our Team
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl mb-8 max-w-3xl mx-auto"
                    >
                        Discover exciting career opportunities and be part of our innovative team at Nanotech Chemical Industry
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}                        className="text-lg"
                    >
                        <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
                            {careers.length} Open Position{careers.length !== 1 ? 's' : ''}
                        </span>
                    </motion.div>
                </div>            
                </section>

            {/* Career Listings */}
            <section className="container mx-auto px-4 pb-16">
                {careers.length === 0 ? (
                    <div className="text-center py-16">
                        <h3 className="text-2xl font-semibold text-gray-600 mb-4">Currently we are not hiring</h3>
                        <p className="text-gray-500">
                            We don't have any open positions at the moment. Please check back later for new opportunities!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {careers.map((career, index) => (
                            <motion.div
                                key={career._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                                    isDeadlinePassed(career.applicationDeadline) ? 'opacity-75' : ''
                                }`}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-bold text-gray-800">{career.title}</h3>
                                                {isDeadlinePassed(career.applicationDeadline) && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                                                        Expired
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-4">{career.description}</p>
                                            
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-blue-500" />
                                                    <span>{career.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaClock className="text-green-500" />
                                                    <span>{career.jobType}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaUsers className="text-purple-500" />
                                                    <span>{career.department}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaDollarSign className="text-yellow-500" />
                                                    <span>{formatSalary(career.salary)}</span>
                                                </div>
                                                {career.applicationDeadline && (
                                                    <div className="flex items-center gap-1">
                                                        <FaCalendarAlt className="text-red-500" />
                                                        <span>Apply by {new Date(career.applicationDeadline).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                                                {career.experienceLevel}
                                            </span>
                                            <button
                                                onClick={() => toggleExpand(career._id)}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                {expandedCard === career._id ? 'Show Less' : 'View Details'}
                                                {expandedCard === career._id ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                        </div>
                                    </div>

                                    {expandedCard === career._id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="border-t pt-6 mt-6"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {career.responsibilities && career.responsibilities.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 mb-3">Key Responsibilities</h4>
                                                        <ul className="space-y-2">
                                                            {career.responsibilities.map((responsibility, idx) => (
                                                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                                                    {responsibility}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                
                                                {career.requirements && career.requirements.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 mb-3">Requirements</h4>
                                                        <ul className="space-y-2">
                                                            {career.requirements.map((requirement, idx) => (
                                                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                                                    {requirement}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                
                                                {career.qualifications && career.qualifications.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 mb-3">Qualifications</h4>
                                                        <ul className="space-y-2">
                                                            {career.qualifications.map((qualification, idx) => (
                                                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                                                    {qualification}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>                                            <div className="mt-6 pt-4 border-t flex justify-between items-center">
                                                <div className="text-sm text-gray-500">
                                                    Posted on {new Date(career.createdAt).toLocaleDateString()}
                                                </div>
                                                {!isDeadlinePassed(career.applicationDeadline) && (
                                                    <div className="flex items-center gap-2 text-blue-600">
                                                        <FaEnvelope />
                                                        <span className="text-sm">Contact us to apply</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>                )}
            </section>
        </div>
    );
};

export default Career;
