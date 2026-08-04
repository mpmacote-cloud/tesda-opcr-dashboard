import React, { useEffect, useState } from "react";
import { apiFetch } from "../../api";
import { buttonStyles } from "../../styles/buttonStyles";

function OperatingUnitManager() {

    const [operatingUnits, setOperatingUnits] = useState([]);

    const [editOperatingUnit, setEditOperatingUnit] = useState(null);

    const [operatingUnitForm, setOperatingUnitForm] = useState({
    code: "",
    name: "",
    status: "ACTIVE"
});

const loadOperatingUnits = async () => {

    try {

        const res = await apiFetch("/api/master/operating-units");

        const data = await res.json();

        setOperatingUnits(data);

    } catch (err) {

        console.error("Unable to load Operating Units", err);

    }
};

const saveOperatingUnit = async () => {

    try {

        if (
            !operatingUnitForm.code.trim() ||
            !operatingUnitForm.name.trim()
        ) {

            alert("Please complete all required fields.");
            return;

        }

        let res;

        if (editOperatingUnit === null) {

            // ADD

            res = await apiFetch(
                "/api/master/operating-units",
                {
                    method: "POST",
                    body: JSON.stringify(operatingUnitForm)
                }
            );

        } else {

            // EDIT

            res = await apiFetch(
                `/api/master/operating-units/${editOperatingUnit}`,
                {
                    method: "PUT",
                    body: JSON.stringify(operatingUnitForm)
                }
            );

        }

        const data = await res.json();

        if (!data.success) {

            alert(data.message);
            return;

        }

        await loadOperatingUnits();

        setOperatingUnitForm({
            code: "",
            name: "",
            status: "ACTIVE"
        });

        setEditOperatingUnit(null);

    } catch (err) {

        console.error(err);

        alert("Unable to save Operating Unit.");

    }

};

useEffect(() => {

    loadOperatingUnits();

}, []);

    return (

       /* <>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 15
                }}
            >

                <div>

                    <h2 style={{ margin: 0 }}>
                        Operating Unit Management
                    </h2>

                    <p
                        style={{
                            marginTop: 5,
                            color: "#666"
                        }}
                    >
                        Manage all TESDA Operating Units here.
                    </p>

                </div>

                <button
                    style={btn}
                    onClick={() => {

                        setEditOperatingUnit(null);

                        setOperatingUnitForm({

                            code: "",

                            name: "",

                            status: "ACTIVE"

                        });

                    }}
                >
                    + Add Operating Unit
                </button>

            </div>

        </> */

         <div
    style={{
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,.15)"
    }}
>

    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20
        }}
    >

        <div>

            <h2
                style={{
                    margin: 0
                }}
            >
                Operating Unit Management
            </h2>

            <p
                style={{
                    marginTop: 5,
                    color: "#666"
                }}
            >
                Manage all TESDA Operating Units
            </p>

        </div>

        <button
            style={buttonStyles.save}
            onClick={() => {

                setEditOperatingUnit(null);

                setOperatingUnitForm({
                    code: "",
                    name: "",
                    status: "ACTIVE"
                });

            }}
        >
            + Add Operating Unit
        </button>

    </div>

    <div
        style={{
            background: "#f7f7f7",
            padding: 15,
            borderRadius: 8
        }}
    >

        <strong>
            Total Operating Units:
        </strong>

        {" "}

        {operatingUnits.length}

    </div>

<div
    style={{
        marginTop: 25,
        display: "grid",
        gridTemplateColumns: "1fr 2fr 1fr",
        gap: 15
    }}
>

    <div>

        <label>Code</label>

        <input
            type="text"
            value={operatingUnitForm.code}
            onChange={(e) =>
                setOperatingUnitForm({
                    ...operatingUnitForm,
                    code: e.target.value
                })
            }
            style={{
                width: "100%",
                padding: 8,
                marginTop: 5
            }}
        />

    </div>

    <div>

        <label>Operating Unit</label>

        <input
            type="text"
            value={operatingUnitForm.name}
            onChange={(e) =>
                setOperatingUnitForm({
                    ...operatingUnitForm,
                    name: e.target.value
                })
            }
            style={{
                width: "100%",
                padding: 8,
                marginTop: 5
            }}
        />

    </div>

    <div>

        <label>Status</label>

        <select
            value={operatingUnitForm.status}
            onChange={(e) =>
                setOperatingUnitForm({
                    ...operatingUnitForm,
                    status: e.target.value
                })
            }
            style={{
                width: "100%",
                padding: 8,
                marginTop: 5
            }}
        >

            <option value="ACTIVE">
                ACTIVE
            </option>

            <option value="INACTIVE">
                INACTIVE
            </option>

        </select>

    </div>

</div>
<div
    style={{
        marginTop: 20,
        display: "flex",
        gap: 10
    }}
>

    <button
        style={buttonStyles.save}
        onClick={saveOperatingUnit}
    >
        {editOperatingUnit === null
            ? "Save Operating Unit"
            : "Save Changes"}
    </button>

    {editOperatingUnit !== null && (

        <button
            style={buttonStyles.cancel}
            onClick={() => {

                setEditOperatingUnit(null);

                setOperatingUnitForm({
                    code: "",
                    name: "",
                    status: "ACTIVE"
                });

            }}
        >
            Cancel
        </button>

    )}

</div>
<hr style={{ margin: "30px 0" }} />

<table
    style={{
        width: "100%",
        borderCollapse: "collapse"
    }}
>

    <thead>

        <tr
            style={{
                background: "#1976d2",
                color: "#fff"
            }}
        >

           <th style={{ padding: 10, textAlign: "left" }}>ID</th>
            <th style={{ padding: 10, textAlign: "left" }}>Code</th>
<th style={{ padding: 10, textAlign: "left" }}>Operating Unit</th>
<th style={{ padding: 10, textAlign: "left" }}>Status</th>
<th style={{ padding: 10, textAlign: "left" }}>Actions</th>

        </tr>

    </thead>

    <tbody>

        {operatingUnits.map((unit) => (

            <tr
                key={unit.id}
                style={{
                    borderBottom: "1px solid #ddd"
                }}
            >

               <td
    style={{
        padding: 10,
        textAlign: "left"
    }}
>
                    {unit.id}
                </td>

                <td
    style={{
        padding: 10,
        textAlign: "left"
    }}
>
                    {unit.code}
                </td>

               <td
    style={{
        padding: 10,
        textAlign: "left"
    }}
>
                    {unit.name}
                </td>

                <td
    style={{
        padding: 10,
        textAlign: "left"
    }}
>
                    {unit.status}
                </td>

               <td
    style={{
        padding: 10,
        textAlign: "left"
    }}
>

                   <button
    style={buttonStyles.edit}
    onClick={() => {

        setEditOperatingUnit(unit.id);

        setOperatingUnitForm({
            code: unit.code,
            name: unit.name,
            status: unit.status
        });

    }}
>
    Edit
</button>

                </td>

            </tr>

        ))}

    </tbody>

</table>
</div>

    ); 



}

export default OperatingUnitManager;