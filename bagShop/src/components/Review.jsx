import React from 'react'
import './review.css'
import GradientText from '../component/GradientText'



const Review = () => {
  return (
    <>
    <div className="rmain">
        <GradientText
                colors={["#23989A","#117173","#b0f0f1"]}
                animationSpeed={8}
                showBorder={false}
                className="custom-class"
                style={{ fontSize: '5rem', fontWeight: '500', textAlign: 'center', marginTop: '4rem' }}
              >
                REVIEWS
              </GradientText>
        <hr style={{ width: '80%', color: '#23989A', margin: '4rem 0', justifySelf: 'center' }} />

        <div className="reviews">
        </div>
    </div>
    </>
  )
}

export default Review