import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Divider } from 'antd';
const History = ({ historyObj }) => {
    useEffect(() => {
        console.log(historyObj)
    }, [])


    return (
        <div className="container">
            {
                historyObj.length === 0
                    ?
                    <div> No history found for this event </div>
                    :
                    <div>
                        {
                            historyObj.map((data, index) => {
                                return (
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-6" style={{
                                                textAlign: 'right'
                                            }}>
                                                Doctor Assigned
                                            </div>
                                            <div className="col-6">
                                                {data.doctorAssigned}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6" style={{
                                                textAlign: 'right'
                                            }}>
                                                Shift Type
                                            </div>
                                            <div className="col-6">
                                                {data.shiftName}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6" style={{
                                                textAlign: 'right'
                                            }}>
                                                Shift Date
                                            </div>
                                            <div className="col-6">
                                                {new Date(data.shiftDate).toUTCString(('default', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                            </div>
                                        </div>
                                        {data.message != "Created FirstTime" ?
                                            <div className="row">
                                                <div className="col-12" style={{
                                                    textAlign: 'center',
                                                    fontStyle: 'italic'
                                                }}>
                                                    Modified by {data.modifiedBy} on {new Date(data.swappingDate).toUTCString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>

                                            </div> :
                                            <div className="row">
                                                <div className="col-12" style={{
                                                    textAlign: 'center',
                                                    fontStyle: 'italic'
                                                }}>
                                                    Created by {data.modifiedBy} on {new Date(data.swappingDate).toUTCString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>

                                            </div>
                                        }

                                        <Divider />
                                    </div>
                                )
                            })
                        }
                    </div>
            }
        </div>
    )
}
export default History;
