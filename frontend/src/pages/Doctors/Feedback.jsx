import React, { useState } from 'react';
import FeedbackForm from './FeedbackForm';
import useFetchData from '../../hooks/useFetchData.jsx';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import avatar from '../../assets/images/avatar-icon.png';
import { AiFillStar } from 'react-icons/ai';

const Feedback = () => {
    const { doctorId } = useParams();
    const { data: reviews, setData: setReviews, loading, error } = useFetchData(
        `http://localhost/hospitalWebPage/backend/api/v1/doctors/${doctorId}/reviews`
    );

    const handleFeedbackSubmitted = (newReview) => {
        setReviews((prevReviews) => [...prevReviews, newReview]);
    };

    if (loading) return <p>Loading reviews...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h4 className="text-[20px] leading-[30px] font-bold text-headingColor mb-[30px] mt-[15px]">
                All reviews ({reviews.length})
            </h4>

            {reviews.map((review) => (
                <div key={review.id} className="flex justify-between gap-10 mb-[30px]">
                    <div className="flex gap-3">
                        <figure className="w-10 h-10 rounded-full">
                            <img className="w-full" src={avatar} alt="avatar" />
                        </figure>

                        <div>
                            {/* Reviewer name and stars in the same line */}
                            <div className="flex items-center gap-2">
                                <p className="text-[16px] leading-6 text-primaryColor font-bold">
                                    {review.reviewer_name || 'Anonymous'}
                                </p>
                                <div className="flex">
                                    {[...Array(Number(review.rating))].map((_, index) => (
                                        <AiFillStar key={index} color="#0067FF" />
                                    ))}
                                </div>
                            </div>

                            <p className="text-[16px] font-bold">
                                {review.reviewer_email || 'Anonymous'}
                            </p>
                            <p className="text-[14px] leading-6 text-textColor">
                                {formatDate(review.created_at)}
                            </p>

                            <p className="text__para mt-3 font-medium text-[15px]">
                                {review.reviewText}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            <FeedbackForm doctorId={doctorId} onFeedbackSubmitted={handleFeedbackSubmitted} />
        </div>
    );
};

export default Feedback;
