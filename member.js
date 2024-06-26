function skillsMember() {
  var member = document.getElementById("skillsMember");
  var memberValue = member.options[member.selectedIndex].value;
  var memberText = member.options[member.selectedIndex].text;
  return memberText;
}