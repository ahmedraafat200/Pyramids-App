import React from 'react';
import {View, Image} from 'react-native';
import styles from './styles';
import StepCurrent from '../../../assets/steps/stepcurrent.png';
import StepDone from '../../../assets/steps/stepdone.png';
import StepNext from '../../../assets/steps/stepnext.png';

const bgColor = "#0069FF";
const lineNext = "#b3bac5";
const lineDone = "#004FC0";

const Steps = ({step, totalSteps, classNames}) => {
   
    return (
        <View backgroundColor={bgColor} style={styles.navigator} className={classNames}>
            {[...Array(totalSteps - 1)].map((e,i) => {
              return (
                <React.Fragment key={i}>
                    <Image
                        source={i + 1 < step ? StepDone : i + 1 == step ? StepCurrent : StepNext}
                        style={styles.stepIcon}
                        resizeMode="contain"               
                    />
                    <View style={styles.lineSteps} backgroundColor={i + 1 <= step -1 ? lineDone : lineNext} ></View>
                </React.Fragment>
              )
            })} 
            <Image 
                style={styles.stepIcon}
                resizeMode="contain"
                source={step == totalSteps ? StepCurrent : step > totalSteps ? StepDone : StepNext}
            />
        </View>
    );
};

export default Steps;
