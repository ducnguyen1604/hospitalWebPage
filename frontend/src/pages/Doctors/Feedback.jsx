import React, { useState } from 'react';
import { formatDate } from '../../utils/formatDate';
import avatar from '../../assets/images/avatar-icon.png';
import { AiFillStar } from 'react-icons/ai';
import FeedbackForm from './FeedbackForm';
import useFetchData from '../../hooks/useFetchData.jsx'; // Adjust path as needed
import { useParams } from 'react-router-dom';

const Feedback = () => {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const { doctorId } = useParams();

    const { data: reviews = [], loading, error } = useFetchData(
        `http://localhost/hospitalWebPage/backend/api/v1/doctors/${doctorId}/reviews`
    );

    console.log(reviews);

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <div className="mb-[50px] mt-4">
                <h4 className="text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]">
                    All reviews ({reviews ? reviews.length : 0})
                </h4>

                {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="flex justify-between gap-10 mb-[30px]"
                        >
                            <div className="flex gap-3">
                                <figure className="w-10 h-10 rounded-full">
                                    <img className="w-full" src={avatar} alt="avatar" />
                                </figure>

                                <div>
                                    <h5 className="text-[16px] leading-6 text-primaryColor font-bold">
                                        {review.user_name || 'Anonymous'}
                                    </h5>
                                    <p className="text-[14px] leading-6 text-textColor">
                                        {formatDate(review.created_at)}
                                    </p>
                                    <p className="text__para mt-3 font-medium text-[15px]">
                                        {review.reviewText}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-1">
                            {[...Array(Math.min(Math.max(Number(review.rating), 0), 5))].map((_, index) => (
                                    <AiFillStar key={index} color="#0067FF" />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No reviews available.</p>
                )}

            </div>

            {!showFeedbackForm && (
                <div className="text-center">
                    <button
                        className="btn"
                        onClick={() => setShowFeedbackForm(true)}
                    >
                        Give Feedback
                    </button>
                </div>
            )}

            {showFeedbackForm && <FeedbackForm />}
        </div>
    );
};

export default Feedback;
