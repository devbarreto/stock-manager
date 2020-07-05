import React, { useRef } from "react";
import { Link } from "react-router-dom";
import routesPath from "../../constants/routesPath";
import HeadingContainer from "../../components/HeadingContainer";
import FlexContainer from "../../components/FlexContainer";
import colorPallet from "../../constants/colorPallet";
import { FiArrowLeft } from "react-icons/fi";
import IconButton from "../../components/IconButton/icon";
import { useState } from "react";
import longMaxValue from "../../constants/longMaxValue";
import BrandsService from "../../services/BrandsService";
import { notAllDataErrorMessage } from "../../constants/notAllDataErrorMessage";
import ExtraIdInfo from "../../components/ExtraIdInfo";
const Brands = () => {
  const inputIdField = useRef(null);
  const inputNameField = useRef(null);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [disableIdField, setDisableIdField] = useState(true);

  const handleId = (event) => setId(event.target.value);
  const handleName = (event) => setName(event.target.value);
  const handleDescription = (event) => setDescription(event.target.value);

  const setFocusOnIdField = () => inputIdField.current.focus();
  const setFocusOnNameField = () => inputNameField.current.focus();

  function getFormData() {
    return {
      id,
      name,
      description,
    };
  }

  const setFormData = (brand) => {
    setName(brand.name);
    setDescription(brand.description);
  };

  async function handleAdd() {
    const newBrand = getFormData();
    if (!checkIfIsValidBrand(newBrand)) {
      alert(notAllDataErrorMessage);
      return;
    }
    try {
      await BrandsService.newBrand(newBrand);
      alert("Marca cadastrada com sucesso!");
      handleClear();
    } catch (error) {
      alert("Erro ao cadastrar marca. Tente novamente mais tarde!");
      console.log("Error!", error);
    }
  }

  function handleSearch() {
    const safeDelay = 100;
    handleClear();
    setDisableIdField(false);
    setTimeout(setFocusOnIdField, safeDelay);
  }

  async function handleEdit() {
    const brandToEdit = getFormData();
    if (!checkIfIsValidBrand(brandToEdit)) {
      alert(notAllDataErrorMessage);
      return;
    }
    try {
      await BrandsService.updateBrand(id, brandToEdit);
      alert("Marca atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar marca. Tente novamente mais tarde!");
      console.log("Error!", error);
    }
  }
  async function handleDelete() {
    const brandToDelete = getFormData();
    if (!checkIfIsValidBrand(brandToDelete)) {
      alert(
        "Antes de remover uma marca pesquise-o e verifique se realmente deseja o excluir."
      );
      return;
    }
    const deleteConfirmation = window.confirm(
      `Você realmente deseja deletar os dados referentes à marca: ${name}`
    );

    if (deleteConfirmation) {
      try {
        await BrandsService.deleteBrand(id);
        alert("Marca removido com sucesso!");
        handleClear();
      } catch (error) {
        alert("Erro ao remover marca. Tente novamente mais tarde!");
        console.log("Error!", error);
      }
    }
  }

  function handleClear() {
    setId("");
    setDisableIdField(true);
    setName("");
    setDescription("");
    setFocusOnNameField();
  }

  const options = [
    { text: "Incluir", iconName: "FiPlusCircle", action: handleAdd },
    { text: "Pesquisar", iconName: "FiSearch", action: handleSearch },
    { text: "Editar", iconName: "FiEdit", action: handleEdit },
    { text: "Remover", iconName: "FiTrash2", action: handleDelete },
    { text: "Limpar", iconName: "FiDelete", action: handleClear },
  ];

  const checkIfIsValidBrand = (brand) => {
    return !!brand && !!brand.name && !!brand.description;
  };

  async function findBrand(id) {
    const response = await BrandsService.getBrand(id);
    const isValidBrand = checkIfIsValidBrand(response);
    if (!isValidBrand) {
      alert("Essa marca não foi encontrada.");
      handleClear();
      return;
    }

    setFormData(response);
  }

  const handleIdKeyUp = (event) => {
    const key = event.key;
    const listenedKey = "Enter";
    if (key === listenedKey) {
      findBrand(id);
      setDisableIdField(true);
      setFocusOnNameField();
    }
  };

  const handleIdOnBlur = () => {
    setDisableIdField(true);
  };

  return (
    <HeadingContainer heading="Marcas" maxWidth="500px">
      <form>
        <FlexContainer direction="column" alignItems="left">
          <label htmlFor="brand-id">
            <ExtraIdInfo isDisabled={disableIdField} />
          </label>
          <input
            ref={inputIdField}
            id="brand-id"
            type="number"
            min={1}
            value={id}
            max={longMaxValue}
            onKeyUp={handleIdKeyUp}
            onBlur={handleIdOnBlur}
            onChange={handleId}
            disabled={disableIdField}
          />
        </FlexContainer>
        <FlexContainer direction="column" alignItems="left">
          <label htmlFor="brand-name">Nome</label>
          <input
            id="brand-name"
            type="text"
            value={name}
            ref={inputNameField}
            onChange={handleName}
          />
        </FlexContainer>
        <FlexContainer direction="column" alignItems="left">
          <label htmlFor="brand-description">Descrição</label>
          <textarea
            id="brand-description"
            type="text"
            value={description}
            onChange={handleDescription}
          />
        </FlexContainer>
      </form>

      <FlexContainer>
        {options.map(({ text, iconName, action }, key) => (
          <IconButton
            key={key}
            width="19%"
            iconName={iconName}
            onClick={action}
          >
            <p>{text}</p>
          </IconButton>
        ))}
      </FlexContainer>

      <FlexContainer>
        <Link to={routesPath.StockManager}>
          <FlexContainer justifyContent="left">
            <FiArrowLeft size={16} color={colorPallet.blue.high} />
            <p style={{ marginRight: 8 }}>Voltar para Stock Manager</p>
          </FlexContainer>
        </Link>
      </FlexContainer>
    </HeadingContainer>
  );
};

export default Brands;
