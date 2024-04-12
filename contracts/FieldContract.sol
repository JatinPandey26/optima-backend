// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OptimaContract {
    struct Field {
        string fieldName;
        string fieldValue;
        string fieldType;
        string optimaIdentifier;
    }

    mapping(string => Field[]) fieldsByOptimaIdentifier;

    function saveField(
        string memory _fieldName,
        string memory _fieldValue,
        string memory _fieldType,
        string memory _optimaIdentifier
    ) public {
        Field memory newField = Field({
            fieldName: _fieldName,
            fieldValue: _fieldValue,
            fieldType: _fieldType,
            optimaIdentifier: _optimaIdentifier
        });
        fieldsByOptimaIdentifier[_optimaIdentifier].push(newField);
    }

    function getFieldsByOptimaIdentifier(string memory _optimaIdentifier)
        public
        view
        returns (Field[] memory)
    {
        return fieldsByOptimaIdentifier[_optimaIdentifier];
    }
}
