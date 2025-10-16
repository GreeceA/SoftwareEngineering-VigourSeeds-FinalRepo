import FieldVisitForm from './FieldVisitForm';

export default function Edit(props) {
    // Pass all props down, including the fieldVisit object
    return <FieldVisitForm {...props} />;
}