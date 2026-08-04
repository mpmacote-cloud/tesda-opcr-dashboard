import OperatingUnitManager from "./OperatingUnitManager";
import React, { useState } from "react";

function MasterData() {

    const [activeModule, setActiveModule] = useState("operatingUnits");

    const tabStyle = (active) => ({
        padding: "10px 18px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        background: active ? "#1976d2" : "#e0e0e0",
        color: active ? "#fff" : "#333"
    });

    return (

        <div>

            <h2 style={{ marginBottom: 5 }}>
                Master Data
            </h2>

            <p style={{ color: "#666" }}>
                Manage all TBPMIS master records.
            </p>

            <div
                style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 20,
                    marginBottom: 25
                }}
            >

                <button
                    style={tabStyle(activeModule === "operatingUnits")}
                    onClick={() => setActiveModule("operatingUnits")}
                >
                    Operating Units
                </button>

                <button
                    style={tabStyle(activeModule === "focalships")}
                    onClick={() => setActiveModule("focalships")}
                >
                    Focalships
                </button>

                <button
                    style={tabStyle(false)}
                    disabled
                >
                    PAP
                </button>

                <button
                    style={tabStyle(false)}
                    disabled
                >
                    KPI
                </button>

                <button
                    style={tabStyle(false)}
                    disabled
                >
                    Timeline
                </button>

            </div>

            <hr />
{activeModule === "operatingUnits" && (

  <OperatingUnitManager />

)}

            {activeModule === "focalships" && (

                <div>

                    <h3>Focalship Management</h3>

                    <p>
                        Focalship module will be built here.
                    </p>

                </div>

            )}

        </div>

    );

}

export default MasterData;